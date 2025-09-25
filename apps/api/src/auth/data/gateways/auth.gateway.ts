import { Injectable } from '@nestjs/common';
import { AuthGateway } from 'src/auth/abstractions/gateways/auth.gateway';
import { SurveyorModel } from 'src/surveyor/abstractions/models/surveyor.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';

@Injectable()
export class AuthGatewayImplementation implements AuthGateway {
  constructor(
    @InjectRepository(SurveyorModel)
    private readonly surveyorRepository: Repository<SurveyorModel>,
    private readonly jwtService: JwtService,
    private readonly redis: Redis,
  ) {}

  async signIn(data: AuthGateway.SignInData): Promise<SurveyorModel | null> {
    const surveyor = await this.surveyorRepository.findOne({
      where: { email: data.email },
    });

    if (!surveyor) {
      return null;
    }

    const isPasswordValid = await argon2.verify(
      surveyor.password,
      data.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    return surveyor;
  }

  async mintTokens({
    surveyorId: sub,
    refreshable,
  }: AuthGateway.MintTokensData): Promise<AuthGateway.MintTokensResult> {
    const accessToken = this.jwtService.sign(
      { sub },
      {
        expiresIn: '15m',
      },
    );
    await this.redis.sadd(`active-tokens:${sub}`, accessToken);

    if (refreshable) {
      const refreshToken = this.jwtService.sign(
        { sub },
        {
          expiresIn: '1d',
        },
      );
      await this.redis.setex(
        `refresh-token:${sub}`,
        60 * 60 * 24,
        refreshToken,
      );

      return { accessToken, refreshToken };
    }

    return { accessToken };
  }

  async validateRefreshToken(
    data: AuthGateway.ValidateRefreshTokenData,
  ): Promise<boolean> {
    const { sub } = this.jwtService.verify(data.refreshToken);
    const refreshToken = await this.redis.get(`refresh-token:${sub}`);
    return !!refreshToken;
  }

  async validateAccessToken(
    data: AuthGateway.ValidateAccessTokenData,
  ): Promise<boolean> {
    const { sub } = this.jwtService.verify(data.accessToken);
    const activeTokens = await this.redis.smembers(`active-tokens:${sub}`);
    return activeTokens.includes(data.accessToken);
  }

  async logOut(data: AuthGateway.LogOutData): Promise<void> {
    await this.redis.del(`refresh-token:${data.surveyorId}`);
    await this.redis.srem(`active-tokens:${data.surveyorId}`, data.accessToken);
  }
}

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserModel } from 'src/auth/abstractions/models/user.model';
import { AuthGateway } from 'src/auth/abstractions/gateways/auth.gateway';
import { AuthGatewayImplementation } from 'src/auth/data/gateways/auth.gateway';
import { ErrorCode } from '@fullstack-q3/contracts';
import { Request } from 'express';

@Injectable()
export class SurveyorRefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'surveyor-refresh-token',
) {
  constructor(
    configService: ConfigService,
    @Inject(AuthGatewayImplementation)
    private readonly authGateway: AuthGateway,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(req: Request, payload: { sub: number }): Promise<UserModel> {
    const isValid = await this.authGateway.validateRefreshToken({
      refreshToken: req.headers['authorization']?.split(' ')[1] ?? '',
    });
    if (!isValid) {
      throw new UnauthorizedException({
        errorCode: ErrorCode.UNAUTHORIZED_SURVEYOR_REFRESH_TOKEN,
      });
    }
    return { id: payload.sub };
  }
}

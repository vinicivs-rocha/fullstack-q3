import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGateway } from 'src/auth/abstractions/gateways/auth.gateway';
import { UserModel } from 'src/auth/abstractions/models/user.model';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ErrorCode } from 'node_modules/@fullstack-q3/contracts/dist/error-code';
import { AuthGatewayImplementation } from 'src/auth/data/gateways/auth.gateway';

@Injectable()
export class SurveyorJwtStrategy extends PassportStrategy(
  Strategy,
  'surveyor-access-token',
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
    const isValid = await this.authGateway.validateAccessToken({
      accessToken: req.headers['authorization']?.split(' ')[1] ?? '',
    });
    if (!isValid) {
      throw new UnauthorizedException({
        errorCode: ErrorCode.UNAUTHORIZED_SURVEYOR_ACCESS_TOKEN,
      });
    }
    return { id: payload.sub };
  }
}

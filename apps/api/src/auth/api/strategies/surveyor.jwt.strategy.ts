import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserModel } from 'src/auth/abstractions/models/user.model';

@Injectable()
export class SurveyorJwtStrategy extends PassportStrategy(
  Strategy,
  'surveyor-access-token',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  validate(payload: { sub: number }): UserModel {
    return { id: payload.sub };
  }
}

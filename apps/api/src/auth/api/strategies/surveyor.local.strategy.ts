import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthGatewayImplementation } from 'src/auth/data/gateways/auth.gateway';
import { AuthGateway } from 'src/auth/abstractions/gateways/auth.gateway';
import { SurveyorModel } from 'src/surveyor/abstractions/models/surveyor.model';
import { ErrorCode } from '@fullstack-q3/contracts';

@Injectable()
export class SurveyorLocalStrategy extends PassportStrategy(
  Strategy,
  'surveyor-local',
) {
  constructor(
    @Inject(AuthGatewayImplementation)
    private readonly authRepository: AuthGateway,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<SurveyorModel> {
    const surveyor = await this.authRepository.signIn({ email, password });

    if (!surveyor) {
      throw new UnauthorizedException({
        errorCode: ErrorCode['UNAUTHORIZED_SURVEYOR'],
      });
    }

    return surveyor;
  }
}

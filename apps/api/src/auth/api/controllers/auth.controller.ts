import { RefreshTokenResponse, SignInResponse } from '@fullstack-q3/contracts';
import { Controller, Headers, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthGatewayImplementation } from 'src/auth/data/gateways/auth.gateway';
import { SurveyorModel } from 'src/surveyor/abstractions/models/surveyor.model';
import { AuthGateway } from '../../abstractions/gateways/auth.gateway';
import { User } from '../decorators/user.decorator';
import { SurveyorLocalGuard } from '../guards/surveyor.local.guard';
import { UserModel } from 'src/auth/abstractions/models/user.model';
import { SurveyorRefreshJwtGuard } from '../guards/surveyor-refresh.jwt.guard';
import { SurveyorJwtGuard } from '../guards/surveyor.jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthGatewayImplementation)
    private readonly authGateway: AuthGateway,
  ) {}

  @Post('sign-in')
  @UseGuards(SurveyorLocalGuard)
  async signIn(@User() user: SurveyorModel): Promise<SignInResponse> {
    const { accessToken, refreshToken } = await this.authGateway.mintTokens({
      surveyorId: user.id,
      refreshable: true,
    });

    return {
      accessToken,
      refreshToken: refreshToken!,
    };
  }

  @Post('refresh-token')
  @UseGuards(SurveyorRefreshJwtGuard)
  async refreshToken(@User() user: UserModel): Promise<RefreshTokenResponse> {
    const { accessToken } = await this.authGateway.mintTokens({
      surveyorId: user.id,
    });

    return {
      accessToken,
    };
  }

  @Post('log-out')
  @UseGuards(SurveyorJwtGuard)
  async logOut(
    @User() user: UserModel,
    @Headers('authorization') authorization: string,
  ): Promise<void> {
    await this.authGateway.logOut({
      surveyorId: user.id,
      accessToken: authorization.split(' ')[1] ?? '',
    });
  }
}

import { ErrorCode } from '@fullstack-q3/contracts';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserModel } from 'src/auth/abstractions/models/user.model';

@Injectable()
export class SurveyorRefreshJwtGuard extends AuthGuard(
  'surveyor-refresh-token',
) {
  handleRequest<TUser = UserModel>(err: unknown, user: TUser): TUser {
    if (err || !user) {
      throw new UnauthorizedException({
        errorCode: ErrorCode.UNAUTHORIZED_SURVEYOR_REFRESH_TOKEN,
      });
    }
    return user;
  }
}

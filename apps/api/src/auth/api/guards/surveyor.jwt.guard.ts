import { ErrorCode } from '@fullstack-q3/contracts';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserModel } from 'src/auth/abstractions/models/user.model';

@Injectable()
export class SurveyorJwtGuard extends AuthGuard('surveyor-access-token') {
  handleRequest<TUser = UserModel>(
    err: unknown,
    user: TUser,
  ): TUser | undefined {
    if (!user || err) {
      throw new UnauthorizedException({
        errorCode: ErrorCode.UNAUTHORIZED_SURVEYOR_ACCESS_TOKEN,
      });
    }
    return user as TUser;
  }
}

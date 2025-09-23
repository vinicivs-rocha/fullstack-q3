import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SurveyorModel } from 'src/surveyor/abstractions/models/surveyor.model';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SurveyorModel => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as SurveyorModel;
  },
);

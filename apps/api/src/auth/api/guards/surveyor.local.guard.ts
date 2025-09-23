import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SurveyorLocalGuard extends AuthGuard('surveyor-local') {}

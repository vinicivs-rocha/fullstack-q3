import { SurveyorModel } from 'src/surveyor/abstractions/models/surveyor.model';

export abstract class AuthGateway {
  abstract signIn(data: AuthGateway.SignInData): Promise<SurveyorModel | null>;
  abstract mintTokens(
    data: AuthGateway.MintTokensData,
  ): Promise<AuthGateway.MintTokensResult>;
  abstract validateRefreshToken(
    data: AuthGateway.ValidateRefreshTokenData,
  ): Promise<boolean>;
  abstract validateAccessToken(
    data: AuthGateway.ValidateAccessTokenData,
  ): Promise<boolean>;
  abstract logOut(data: AuthGateway.LogOutData): Promise<void>;
}

export namespace AuthGateway {
  export interface SignInData {
    email: string;
    password: string;
  }

  export interface MintTokensData {
    surveyorId: number;
    refreshable?: true;
  }

  export interface MintTokensResult {
    accessToken: string;
    refreshToken?: string;
  }

  export interface ValidateRefreshTokenData {
    refreshToken: string;
  }

  export interface ValidateAccessTokenData {
    accessToken: string;
  }

  export interface LogOutData {
    surveyorId: number;
    accessToken: string;
  }
}

import { injectable, inject } from "inversify";
import { Axios } from "axios";
import { MeResponse, SignInData, SignInResponse } from "@fullstack-q3/contracts";
import { TYPES } from "@/lib/di-types";

@injectable()
export class AuthService {
    constructor(
        @inject(TYPES.Axios) private httpClient: Axios,
    ) {}

    async signIn(data: SignInData): Promise<SignInResponse> {
        const response = await this.httpClient.post('/auth/sign-in', data);
        return response.data;
    }

    async storeToken(tokens: Record<string, string>): Promise<void> {
        Object.entries(tokens).forEach(([key, value]) => {
            sessionStorage.setItem(key, value);
        });
    }

    async isAuthenticated(): Promise<boolean> {
        const token = sessionStorage.getItem('accessToken');
        return !!token;
    }

    async me(): Promise<MeResponse> {
        const response = await this.httpClient.get('/surveyor/me');
        return response.data;
    }

    async refreshToken(): Promise<{ accessToken: string }> {
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await this.httpClient.post('/auth/refresh-token', {
            refreshToken
        });
        return response.data;
    }

    async clearTokens(): Promise<void> {
        sessionStorage.clear();
    }
}
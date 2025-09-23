import { z } from "zod";


export const SignInSchema = z.object({
  email: z
    .email("Digite um email válido")
    .min(1, "Email é obrigatório"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const SignInResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const RefreshTokenResponseSchema = z.object({
  accessToken: z.string(),
});

export const MeResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
});

export type SignInData = z.infer<typeof SignInSchema>;
export type SignInResponse = z.infer<typeof SignInResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
export type MeResponse = z.infer<typeof MeResponseSchema>;
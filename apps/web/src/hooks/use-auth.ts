"use client";
import { container } from "@/lib/di-container";
import { TYPES } from "@/lib/di-types";
import { AuthService } from "@/services/auth.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorCode, SignInData, SignInResponse } from "@fullstack-q3/contracts";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export const useAuth = (
  authService: AuthService = container.get(TYPES.AuthService),
) => {
  const router = useRouter();

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => authService.me(),
    enabled:
      typeof window !== "undefined" && !!sessionStorage.getItem("accessToken"),
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const signInMutation = useMutation({
    mutationFn: (data: SignInData) => authService.signIn(data),
    onSuccess: async (data: SignInResponse) => {
      await authService.storeToken({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken!,
      });
      toast.success("Login realizado com sucesso!");
      router.push("/vistorias");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.errorCode === ErrorCode.UNAUTHORIZED_SURVEYOR
            ? "Credenciais inválidas"
            : "Erro ao fazer login. Verifique suas credenciais e tente novamente.",
        );
      } else {
        toast.error(
          "Erro ao fazer login. Verifique suas credenciais e tente novamente.",
        );
      }
    },
  });

  const logOutMutation = useMutation({
    mutationFn: () => authService.logOut(),
    onSuccess: () => {
      toast.success("Logout realizado com sucesso!");
      router.push("/sign-in");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.errorCode === ErrorCode.UNAUTHORIZED_SURVEYOR
            ? "Credenciais inválidas"
            : "Erro ao fazer login. Verifique suas credenciais e tente novamente.",
        );
      } else {
        toast.error(
          "Erro ao fazer login. Verifique suas credenciais e tente novamente.",
        );
      }
    },
  });

  return {
    signInMutation,
    meQuery,
    logOut: () => logOutMutation.mutate(),
  };
};

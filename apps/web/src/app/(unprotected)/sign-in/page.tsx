"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";

const signInSchema = z.object({
  email: z.email("Digite um email válido").min(1, "Email é obrigatório"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { signInMutation } = useAuth();

  const onSubmit = useCallback(
    async (data: SignInFormData) => {
      await signInMutation.mutateAsync(data);
    },
    [signInMutation],
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-md w-full md:max-w-lg lg:max-w-xl">
        <Card className="shadow-lg md:shadow-xl">
          <CardHeader className="space-y-4 md:space-y-6 pb-6 md:pb-8">
            {/* Logo */}
            <div className="flex flex-col items-center space-y-2 md:space-y-3">
              <div className="flex items-center space-x-3">
                <Image
                  src="/company-logo.svg"
                  alt="EPTA TECNOLOGIA"
                  width={157}
                  height={44}
                  className="w-32 h-8 md:w-40 md:h-10"
                />
              </div>
            </div>

            {/* Título */}
            <div className="text-center space-y-2 md:space-y-3">
              <CardTitle className="text-2xl md:text-3xl font-bold">
                Sistema de Vistorias
              </CardTitle>
              <CardDescription className="text-sm md:text-base">
                Entre com suas credenciais para acessar o sistema
              </CardDescription>
            </div>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CardContent className="space-y-4 md:space-y-6">
                {/* Campo Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm md:text-base">
                        E-mail
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 md:w-6 md:h-6" />
                          <Input
                            type="email"
                            placeholder="Digite seu e-mail"
                            className="pl-10 md:pl-12 h-10 md:h-12 text-sm md:text-base"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Campo Senha */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm md:text-base">
                        Senha
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 md:w-6 md:h-6" />
                          <Input
                            type="password"
                            placeholder="Digite sua senha"
                            className="pl-10 md:pl-12 h-10 md:h-12 text-sm md:text-base"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Link Esqueci minha senha */}
                <div className="text-right">
                  <a href="#" className="text-sm hover:underline">
                    Esqueci minha senha
                  </a>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 md:space-y-6">
                {/* Botão Entrar */}
                <Button
                  type="submit"
                  className="w-full font-medium py-3 md:py-4 rounded-lg flex items-center justify-center space-x-2 text-sm md:text-base"
                  disabled={form.formState.isSubmitting}
                >
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  <span>
                    {form.formState.isSubmitting
                      ? "Entrando..."
                      : "Entrar no Sistema"}
                  </span>
                </Button>

                {/* Linha separadora */}
                <div className="w-full h-px"></div>

                {/* Seção de Suporte */}
                <div className="text-center space-y-1 md:space-y-2">
                  <p className="text-sm md:text-base">
                    Problemas para acessar?
                  </p>
                  <p className="text-sm md:text-base">
                    Entre em contato com o suporte
                  </p>
                </div>

                {/* Versão do Sistema */}
                <div className="text-center">
                  <p className="text-xs md:text-sm">
                    Sistema de Vistorias Veiculares v2.0
                  </p>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}

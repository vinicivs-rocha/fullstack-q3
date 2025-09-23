import "./globals.css";
import QueryClientProviderWrapper from "../components/query-client-provider-wrapper";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <QueryClientProviderWrapper>
        <body>
          {children}
          <Toaster />
        </body>
      </QueryClientProviderWrapper>
    </html>
  );
}

import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { LucideProvider } from "lucide-react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { queryClient } from "../lib/react-query";
import { env } from "../config/env";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={env.googleClientId}>
        <LucideProvider color="currentColor" size={20} strokeWidth={1.75}>
          {children}
        </LucideProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

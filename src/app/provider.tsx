import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { LucideProvider } from "lucide-react";

import { queryClient } from "../lib/react-query";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <LucideProvider color="currentColor" size={20} strokeWidth={1.75}>
        {children}
      </LucideProvider>
    </QueryClientProvider>
  );
}

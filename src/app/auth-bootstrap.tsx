import { type PropsWithChildren, useEffect } from "react";

import { refreshTokenApi } from "../features/auth/api/tokenApi";
import { useAuthStore } from "../stores/authStore";
import { Logo } from "../components/ui/Logo";
import { Spinner } from "../components/ui/Spinner";

export function AuthBootstrap({ children }: PropsWithChildren) {
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setBootstrapping = useAuthStore((state) => state.setBootstrapping);

  useEffect(() => {
    let isMounted = true;

    async function bootstrapAuth() {
      try {
        await refreshTokenApi();

        if (!isMounted) {
          return;
        }

        setAuthenticated(true);
      } catch {
        if (!isMounted) {
          return;
        }

        setAuthenticated(false);
      } finally {
        if (isMounted) {
          setBootstrapping(false);
        }
      }
    }

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [setAuthenticated, setBootstrapping]);

  if (isBootstrapping) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-background">
        <Logo width={72} />
        <Spinner />
      </div>
    );
  }

  return children;
}

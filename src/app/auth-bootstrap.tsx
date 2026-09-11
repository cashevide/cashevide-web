import { type PropsWithChildren, useEffect } from "react";

import { refreshTokenApi } from "../features/auth/api/tokenApi";
import { useAuthStore } from "../stores/authStore";

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
      <div className="flex min-h-svh items-center justify-center">
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  return children;
}

import type { ReactNode } from "react";
import { Navigate } from "react-router";

import { useAuthStore } from "../../stores/authStore";
import { ROUTES } from "../../lib/routes";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.welcome} replace />;
  }

  return children;
}

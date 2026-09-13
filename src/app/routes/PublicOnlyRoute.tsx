import type { ReactNode } from "react";
import { Navigate } from "react-router";

import { useAuthStore } from "../../stores/authStore";
import { ROUTES } from "../../lib/routes";

interface PublicOnlyRouteProps {
  children: ReactNode;
}

// Opposite of ProtectedRoute — redirects an already-authenticated user
// away from public-only pages (welcome, login, signup, password-reset)
// to the dashboard, instead of letting them see the login/signup UI
// again. legal/design-system routes intentionally don't use this guard
// (accessible whether logged in or not) — they aren't nested under
// this layout route.
export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return children;
}

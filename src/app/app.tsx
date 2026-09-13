import { RouterProvider } from "react-router/dom";

import { AppProviders } from "./provider";
import { AuthBootstrap } from "./auth-bootstrap";
import { router } from "./router";
import { useThemeSync } from "../hooks/useThemeSync";

export function App() {
  useThemeSync();

  return (
    <AppProviders>
      <AuthBootstrap>
        <RouterProvider router={router} />
      </AuthBootstrap>
    </AppProviders>
  );
}

import { RouterProvider } from "react-router/dom";

import { AppProviders } from "./provider";
import { AuthBootstrap } from "./auth-bootstrap";
import { router } from "./router";

export function App() {
  return (
    <AppProviders>
      <AuthBootstrap>
        <RouterProvider router={router} />
      </AuthBootstrap>
    </AppProviders>
  );
}

import { createBrowserRouter, Outlet } from "react-router";

import { WelcomeRoute } from "./routes/public/WelcomeRoute";
import { LoginRoute } from "./routes/public/LoginRoute";
import { PasswordResetEmailRoute } from "./routes/public/password-reset/PasswordResetEmailRoute";
import { PasswordResetOtpRoute } from "./routes/public/password-reset/PasswordResetOtpRoute";
import { ResetPasswordRoute } from "./routes/public/password-reset/ResetPasswordRoute";
import { ReferralRoute } from "./routes/signup/ReferralRoute";
import { EmailRoute } from "./routes/signup/EmailRoute";
import { OtpRoute } from "./routes/signup/OtpRoute";
import { AccountRoute } from "./routes/signup/AccountRoute";
import { GoogleReferralRoute } from "./routes/signup/google/GoogleReferralRoute";
import { GoogleUsernameRoute } from "./routes/signup/google/GoogleUsernameRoute";
import { DashboardRoute } from "./routes/DashboardRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute";

export const router = createBrowserRouter([
  {
    // Layout route: PublicOnlyRoute renders once, wraps all children
    // via <Outlet />. New public routes just need to be added as
    // children here — the guard applies automatically, no manual
    // wrapping needed per-route.
    element: (
      <PublicOnlyRoute>
        <Outlet />
      </PublicOnlyRoute>
    ),
    children: [
      { path: "/", element: <WelcomeRoute /> },
      { path: "/login", element: <LoginRoute /> },
      { path: "/password-reset", element: <PasswordResetEmailRoute /> },
      { path: "/password-reset/otp", element: <PasswordResetOtpRoute /> },
      { path: "/password-reset/reset", element: <ResetPasswordRoute /> },
      { path: "/signup/referral", element: <ReferralRoute /> },
      { path: "/signup/email", element: <EmailRoute /> },
      { path: "/signup/otp", element: <OtpRoute /> },
      { path: "/signup/account", element: <AccountRoute /> },
      {
        path: "/signup/google/referral",
        element: <GoogleReferralRoute />,
      },
      {
        path: "/signup/google/username",
        element: <GoogleUsernameRoute />,
      },
    ],
  },
  {
    // Layout route: same pattern for protected routes.
    element: (
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    ),
    // Path is /invoices, not /dashboard — matches Expo's structure,
    // where the invoices feature's own dashboard page is the app's
    // home (reviews dropped, so invoices is the only top-level tab
    // left that makes sense as home). DashboardRoute is still a
    // placeholder component name here; it gets replaced with the real
    // InvoiceDashboardRoute when the invoices feature is built.
    children: [{ path: "/invoices", element: <DashboardRoute /> }],
  },
]);

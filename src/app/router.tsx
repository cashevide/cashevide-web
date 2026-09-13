import { createBrowserRouter } from "react-router";

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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomeRoute />,
  },
  {
    path: "/login",
    element: <LoginRoute />,
  },
  {
    path: "/password-reset",
    element: <PasswordResetEmailRoute />,
  },
  {
    path: "/password-reset/otp",
    element: <PasswordResetOtpRoute />,
  },
  {
    path: "/password-reset/reset",
    element: <ResetPasswordRoute />,
  },
  {
    path: "/signup/referral",
    element: <ReferralRoute />,
  },
  {
    path: "/signup/email",
    element: <EmailRoute />,
  },
  {
    path: "/signup/otp",
    element: <OtpRoute />,
  },
  {
    path: "/signup/account",
    element: <AccountRoute />,
  },
  {
    path: "/signup/google/referral",
    element: <GoogleReferralRoute />,
  },
  {
    path: "/signup/google/username",
    element: <GoogleUsernameRoute />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardRoute />
      </ProtectedRoute>
    ),
  },
]);

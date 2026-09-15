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
import { InvoicesRoute } from "./routes/InvoicesRoute";
import { InvoiceCreateRoute } from "./routes/InvoiceCreateRoute";
import { InvoiceDetailsRoute } from "./routes/InvoiceDetailsRoute";
import { InvoiceEditRoute } from "./routes/InvoiceEditRoute";
import { InvoiceClientsRoute } from "./routes/InvoiceClientsRoute";
import { ClientCreateRoute } from "./routes/ClientCreateRoute";
import { ArchivedClientsRoute } from "./routes/ArchivedClientsRoute";
import { ClientDetailsRoute } from "./routes/ClientDetailsRoute";
import { ClientEditRoute } from "./routes/ClientEditRoute";
import { InvoiceProductsRoute } from "./routes/InvoiceProductsRoute";
import { ProductCreateRoute } from "./routes/ProductCreateRoute";
import { ArchivedProductsRoute } from "./routes/ArchivedProductsRoute";
import { ProductDetailsRoute } from "./routes/ProductDetailsRoute";
import { ProductEditRoute } from "./routes/ProductEditRoute";
import { SettingsRoute } from "./routes/SettingsRoute";
import { ProfileRoute } from "./routes/ProfileRoute";
import { ProfileEditRoute } from "./routes/ProfileEditRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute";
import { AppShell } from "../components/layout/AppShell";
import { DesignSystemLayout } from "./routes/public/design-system/DesignSystemLayout";
import { DesignSystemIndexRoute } from "./routes/public/design-system/DesignSystemIndexRoute";
import { LogoRoute } from "./routes/public/design-system/LogoRoute";
import { ColorsRoute } from "./routes/public/design-system/ColorsRoute";
import { TextRoute } from "./routes/public/design-system/TextRoute";
import { ButtonsRoute } from "./routes/public/design-system/ButtonsRoute";
import { InputsRoute } from "./routes/public/design-system/InputsRoute";
import { CheckboxRoute } from "./routes/public/design-system/CheckboxRoute";
import { SwitchRoute } from "./routes/public/design-system/SwitchRoute";
import { ModalRoute } from "./routes/public/design-system/ModalRoute";
import { PillTabsRoute } from "./routes/public/design-system/PillTabsRoute";
import { AvatarRoute } from "./routes/public/design-system/AvatarRoute";
import { BadgeRoute } from "./routes/public/design-system/BadgeRoute";
import { DividerRoute } from "./routes/public/design-system/DividerRoute";
import { AvatarPickerRoute } from "./routes/public/design-system/AvatarPickerRoute";
import { CurrencyPickerRoute } from "./routes/public/design-system/CurrencyPickerRoute";
import { DateFieldRoute } from "./routes/public/design-system/DateFieldRoute";
import { SpinnerRoute } from "./routes/public/design-system/SpinnerRoute";

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
    // NOT nested under PublicOnlyRoute — Expo's PublicLayout explicitly
    // excluded design-system (and legal) routes from the logged-in
    // redirect (`if (isAuthenticated && !isLegalRoute &&
    // !isDesignSystemRoute)`), so this reference page stays reachable
    // whether the visitor is signed in or not.
    path: "/design-system",
    element: <DesignSystemLayout />,
    children: [
      { index: true, element: <DesignSystemIndexRoute /> },
      { path: "logo", element: <LogoRoute /> },
      { path: "colors", element: <ColorsRoute /> },
      { path: "text", element: <TextRoute /> },
      { path: "buttons", element: <ButtonsRoute /> },
      { path: "inputs", element: <InputsRoute /> },
      { path: "checkbox", element: <CheckboxRoute /> },
      { path: "switch", element: <SwitchRoute /> },
      { path: "modal", element: <ModalRoute /> },
      { path: "pilltabs", element: <PillTabsRoute /> },
      { path: "avatar", element: <AvatarRoute /> },
      { path: "badge", element: <BadgeRoute /> },
      { path: "divider", element: <DividerRoute /> },
      { path: "avatarpicker", element: <AvatarPickerRoute /> },
      { path: "currencypicker", element: <CurrencyPickerRoute /> },
      { path: "datefield", element: <DateFieldRoute /> },
      { path: "spinner", element: <SpinnerRoute /> },
    ],
  },
  {
    // Layout route: ProtectedRoute (auth guard) wraps AppShell
    // (sidebar/bottom-tabs chrome), which in turn wraps whichever tab
    // page is active via its own <Outlet />.
    element: (
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/dashboard", element: <DashboardRoute /> },
          { path: "/invoices", element: <InvoicesRoute /> },
          { path: "/invoices/create", element: <InvoiceCreateRoute /> },
          { path: "/invoices/:id", element: <InvoiceDetailsRoute /> },
          { path: "/invoices/:id/edit", element: <InvoiceEditRoute /> },
          { path: "/invoices/clients", element: <InvoiceClientsRoute /> },
          {
            path: "/invoices/clients/create",
            element: <ClientCreateRoute />,
          },
          {
            path: "/invoices/clients/archived",
            element: <ArchivedClientsRoute />,
          },
          {
            path: "/invoices/clients/:slug",
            element: <ClientDetailsRoute />,
          },
          {
            path: "/invoices/clients/:slug/edit",
            element: <ClientEditRoute />,
          },
          {
            path: "/invoices/products",
            element: <InvoiceProductsRoute />,
          },
          {
            path: "/invoices/products/create",
            element: <ProductCreateRoute />,
          },
          {
            path: "/invoices/products/archived",
            element: <ArchivedProductsRoute />,
          },
          {
            path: "/invoices/products/:slug",
            element: <ProductDetailsRoute />,
          },
          {
            path: "/invoices/products/:slug/edit",
            element: <ProductEditRoute />,
          },
          { path: "/settings", element: <SettingsRoute /> },
          { path: "/profile", element: <ProfileRoute /> },
          { path: "/profile/edit", element: <ProfileEditRoute /> },
        ],
      },
    ],
  },
]);

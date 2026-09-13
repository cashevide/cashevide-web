// App-wide landing route after login/signup — independent of which
// section it currently points to. Change this single value to move
// the app's default home; every redirect site should reference
// ROUTES.home, never a specific feature's own route directly.
export const ROUTES = {
  home: "/invoices",

  welcome: "/",
  login: "/login",

  passwordReset: {
    entry: "/password-reset",
    otp: "/password-reset/otp",
    reset: "/password-reset/reset",
  },

  signup: {
    referral: "/signup/referral",
    email: "/signup/email",
    otp: "/signup/otp",
    account: "/signup/account",

    google: {
      referral: "/signup/google/referral",
      username: "/signup/google/username",
    },
  },

  legal: {
    terms: "/legal/terms",
    privacyPolicy: "/legal/privacy-policy",
  },

  // Only the tab-root paths are here for now (needed by AppShell's
  // sidebar/bottom-tabs). Sub-routes (invoices.list, settings.account,
  // profile.edit, etc.) get added when each feature is actually built
  // — see Expo's routes.ts for the full set when that time comes.
  invoices: {
    dashboard: "/invoices",
  },

  settings: {
    home: "/settings",
  },

  profile: {
    home: "/profile",
  },
} as const;

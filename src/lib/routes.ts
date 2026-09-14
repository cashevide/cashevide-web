// App-wide landing route after login/signup — independent of which
// section it currently points to. Change this single value to move
// the app's default home; every redirect site should reference
// ROUTES.home, never a specific feature's own route directly.
export const ROUTES = {
  home: "/dashboard",

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

  // Dashboard is now its own top-level tab (deliberately deviates from
  // Expo, where dashboard content lived inside /invoices as its first
  // sub-tab).
  dashboard: {
    home: "/dashboard",
  },

  invoices: {
    list: "/invoices",
    create: "/invoices/create",
    detail: (id: number) => `/invoices/${id}` as const,

    clients: {
      list: "/invoices/clients",
    },

    products: {
      list: "/invoices/products",
    },
  },

  settings: {
    home: "/settings",
  },

  profile: {
    home: "/profile",
  },
} as const;

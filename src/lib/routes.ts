// App-wide landing route after login/signup — independent of which
// section it currently points to. Change this single value to move
// the app's default home; every redirect site should reference
// ROUTES.home, never a specific feature's own route directly.
export const ROUTES = {
  home: "/dashboard",

  welcome: "/welcome",
  login: "/login",

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
} as const;

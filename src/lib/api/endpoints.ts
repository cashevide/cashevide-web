export const AUTH_ENDPOINTS = {
  login: "/users/login/",
  logout: "/users/logout/",
  refresh: "/users/token/refresh/",
  profile: "/users/profile/me/",
  businessProfile: "/users/business-profile/me/",

  signup: "/users/signup/",
  signupRequestOtp: "/users/signup-request-otp/",
  signupVerifyOtp: "/users/signup-verify-otp/",
  checkUser: "/users/check-user/",
  checkReferralCode: "/users/check-referral-code/",

  google: "/users/google/",

  passwordResetRequestOtp: "/users/password-reset-request-otp/",
  passwordResetVerifyOtp: "/users/password-reset-verify-otp/",
  resetPassword: "/users/reset-password/",

  changePassword: "/users/change-password/",
  deleteAccount: "/users/profile/delete/",
} as const;

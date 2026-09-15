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

export const CLIENT_ENDPOINTS = {
  list: "/clients/",
  create: "/clients/",
  detail: (slug: string) => `/clients/${slug}/`,
  usage: "/clients/usage/",
} as const;

export const PRODUCT_ENDPOINTS = {
  list: "/products/",
  create: "/products/",
  detail: (slug: string) => `/products/${slug}/`,
  usage: "/products/usage/",
} as const;

export const LEGAL_ENDPOINTS = {
  document: (docType: string) => `/legal/${docType}/`,
  accept: "/legal/accept/",
} as const;

export const INVOICE_ENDPOINTS = {
  list: "/invoices/",
  create: "/invoices/",
  detail: (id: number) => `/invoices/${id}/`,
  downloadPdf: (id: number) => `/invoices/${id}/download-pdf/`,
  dashboardAnalytics: "/invoices/dashboard-analytics/",
} as const;

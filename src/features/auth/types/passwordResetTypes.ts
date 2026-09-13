import type { FieldErrors } from "../../../lib/api/errors";

// -------------------- password-reset-request-otp --------------------

export type PasswordResetRequestOtpRequest = {
  email: string;
};

export type PasswordResetRequestOtpResponse = {
  message: string;
};

// Verified against users/views/otp.py (PasswordResetOTPRequestView
// extends the same BaseOTPRequestView as signup's request-otp
// endpoint): 400 response can be either a per-field error map or
// { error: string } (cooldown/send-failure). Same nuance as
// SignupRequestOtpError in signupTypes.ts.
export type PasswordResetRequestOtpError =
  | FieldErrors<"email">
  | { error: string };

// -------------------- password-reset-verify-otp --------------------

export type PasswordResetVerifyOtpRequest = {
  email: string;
  otp: string;
};

export type PasswordResetVerifyOtpResponse = {
  message: string;
};

// Verified against PasswordResetVerificationSerializer (extends the
// same BaseOTPVerificationSerializer as signup's verify-otp) — all
// validation failures raise ValidationError({"otp": "..."}), no
// { error: string } path for this endpoint.
export type PasswordResetVerifyOtpError = FieldErrors<"otp">;

// -------------------- reset-password (final submit) --------------------

export type ResetPasswordRequest = {
  email: string;
  new_password: string;
};

// Verified against users/views/account.py (PasswordResetView): success
// response is { detail: string }, not { message: string } — this
// endpoint's own naming convention, different from signup/login.
export type ResetPasswordSuccessResponse = {
  detail: string;
};

export type ResetPasswordErrorField = "email" | "new_password";

export type ResetPasswordError = FieldErrors<ResetPasswordErrorField>;

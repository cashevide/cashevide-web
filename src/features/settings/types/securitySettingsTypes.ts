// POST /users/change-password/ — refresh field omitted from the
// request type entirely: Cashevide_API.yaml notes it's only needed
// "if the request is from a mobile platform" (matches
// accountSettingsApi.ts's identical Platform.OS !== "web" check for
// delete-account) — on web the session is cookie-based, so there's
// nothing to attach here.
export type ChangePasswordRequest = {
  current_password?: string;
  new_password: string;
};

// Fixed vs. Expo's version: the real backend schema (PasswordChangeSuccess)
// uses `detail`, not `message`. Verified directly against
// Cashevide_API.yaml.
export type ChangePasswordResponse = {
  detail: string;
};

// Fixed vs. Expo's version: the real backend schema (PasswordChangeError)
// keys the current-password error under `old_password`, not `detail`.
// Verified directly against Cashevide_API.yaml.
export type ChangePasswordError = {
  old_password?: string[];
  new_password?: string[];
};

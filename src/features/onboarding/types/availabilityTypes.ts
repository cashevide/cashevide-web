export type CheckUserField = "username" | "email";

export type CheckUserRequest = {
  field: CheckUserField;
  value: string;
};

export type CheckUserResponse = {
  is_available: boolean;
};

export type CheckReferralCodeRequest = {
  code: string;
};

export type CheckReferralCodeResponse = {
  is_valid: boolean;
  message: string;
};

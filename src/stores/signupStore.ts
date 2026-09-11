import { create } from "zustand";

type SignupState = {
  referralCodeInput: string;
  email: string;
  isEmailOtpVerified: boolean;
  otpCooldownUntil: number | null;

  setReferralCodeInput: (value: string) => void;
  setEmail: (value: string) => void;
  setEmailOtpVerified: (value: boolean) => void;
  setOtpCooldownUntil: (value: number | null) => void;
  resetSignup: () => void;
};

export const useSignupStore = create<SignupState>((set) => ({
  referralCodeInput: "",
  email: "",
  isEmailOtpVerified: false,
  otpCooldownUntil: null,

  setReferralCodeInput: (value) => {
    set({ referralCodeInput: value });
  },

  setEmail: (value) => {
    set({
      email: value,
      isEmailOtpVerified: false,
    });
  },

  setEmailOtpVerified: (value) => {
    set({ isEmailOtpVerified: value });
  },

  setOtpCooldownUntil: (value) => {
    set({ otpCooldownUntil: value });
  },

  resetSignup: () => {
    set({
      referralCodeInput: "",
      email: "",
      isEmailOtpVerified: false,
      otpCooldownUntil: null,
    });
  },
}));

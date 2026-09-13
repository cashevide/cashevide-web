import { create } from "zustand";

type PasswordResetState = {
  email: string;
  isOtpVerified: boolean;
  otpCooldownUntil: number | null;

  setEmail: (value: string) => void;
  setOtpVerified: (value: boolean) => void;
  setOtpCooldownUntil: (value: number | null) => void;
  resetPasswordResetFlow: () => void;
};

export const usePasswordResetStore = create<PasswordResetState>((set) => ({
  email: "",
  isOtpVerified: false,
  otpCooldownUntil: null,

  setEmail: (value) => {
    set({
      email: value,
      isOtpVerified: false,
    });
  },

  setOtpVerified: (value) => {
    set({ isOtpVerified: value });
  },

  setOtpCooldownUntil: (value) => {
    set({ otpCooldownUntil: value });
  },

  resetPasswordResetFlow: () => {
    set({
      email: "",
      isOtpVerified: false,
      otpCooldownUntil: null,
    });
  },
}));

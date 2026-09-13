import { create } from "zustand";

type GoogleAuthState = {
  googleIdToken: string;
  email: string;
  fullName: string;
  referralCodeInput: string;

  setGoogleIdToken: (value: string) => void;
  setProfileInfo: (email: string, fullName: string) => void;
  setReferralCodeInput: (value: string) => void;
  resetGoogleAuth: () => void;
};

export const useGoogleAuthStore = create<GoogleAuthState>((set) => ({
  googleIdToken: "",
  email: "",
  fullName: "",
  referralCodeInput: "",

  setGoogleIdToken: (value) => {
    set({ googleIdToken: value });
  },

  setProfileInfo: (email, fullName) => {
    set({ email, fullName });
  },

  setReferralCodeInput: (value) => {
    set({ referralCodeInput: value });
  },

  resetGoogleAuth: () => {
    set({
      googleIdToken: "",
      email: "",
      fullName: "",
      referralCodeInput: "",
    });
  },
}));

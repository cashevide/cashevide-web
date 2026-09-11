import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  setAuthenticated: (value: boolean) => void;
  setBootstrapping: (value: boolean) => void;
  resetAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isBootstrapping: true,

  setAuthenticated: (value) => {
    set({ isAuthenticated: value });
  },

  setBootstrapping: (value) => {
    set({ isBootstrapping: value });
  },

  resetAuth: () => {
    set({
      isAuthenticated: false,
      isBootstrapping: false,
    });
  },
}));

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingPromptState {
  hasSeenMalayaliPrompt: boolean;
  setHasSeenMalayaliPrompt: (hasSeenMalayaliPrompt: boolean) => void;
}

export const useOnboardingPromptStore = create<OnboardingPromptState>()(
  persist(
    (set) => ({
      hasSeenMalayaliPrompt: false,
      setHasSeenMalayaliPrompt: (hasSeenMalayaliPrompt) =>
        set({ hasSeenMalayaliPrompt }),
    }),
    {
      name: "cashevide-onboarding-prompt",
    },
  ),
);

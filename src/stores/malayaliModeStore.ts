import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MalayaliModeState {
  isMalayaliMode: boolean;
  setMalayaliMode: (isMalayaliMode: boolean) => void;
}

export const useMalayaliModeStore = create<MalayaliModeState>()(
  persist(
    (set) => ({
      isMalayaliMode: false,
      setMalayaliMode: (isMalayaliMode) => set({ isMalayaliMode }),
    }),
    {
      name: "cashevide-malayali-mode",
    },
  ),
);

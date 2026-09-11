import { extendTailwindMerge } from "tailwind-merge";

export const cn = extendTailwindMerge({
  extend: {
    classGroups: {
      "max-w": ["max-w-narrow", "max-w-desktop"],
    },
  },
});

import { useMalayaliModeStore } from "../stores/malayaliModeStore";
import { en } from "./en";
import { malayali } from "./malayali";

import type { ContentKey } from "./keys";

// const t = useContent();
// <Text>{t("dashboard.shareCard.title")}</Text>
//
// Switches automatically when Malayali Mode is toggled, since it reads
// straight from the store — no extra plumbing needed in the component
// beyond calling this hook.
export function useContent() {
  const isMalayaliMode = useMalayaliModeStore((state) => state.isMalayaliMode);
  const content = isMalayaliMode ? malayali : en;

  return function t(key: ContentKey): string {
    return content[key];
  };
}

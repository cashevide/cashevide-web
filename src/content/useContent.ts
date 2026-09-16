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
//
// Pass forceNormalMode: true to opt a screen out of Malayali Mode
// entirely, regardless of the global toggle — e.g. the Settings-
// triggered "Buy Me a Coffee" flow, which always wants plain/
// professional copy even when the user has Malayali Mode on
// elsewhere in the app. Omit it (or pass false) for normal
// store-driven behavior.
export function useContent(forceNormalMode = false) {
  const isMalayaliModeFromStore = useMalayaliModeStore(
    (state) => state.isMalayaliMode,
  );
  const isMalayaliMode = forceNormalMode ? false : isMalayaliModeFromStore;
  const content = isMalayaliMode ? malayali : en;

  return function t(key: ContentKey): string {
    return content[key];
  };
}

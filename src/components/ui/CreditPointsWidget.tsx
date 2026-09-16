import { useState } from "react";

import { CreditBadge } from "./CreditBadge";
import { CreditPointsDialog } from "./CreditPointsDialog";
import { useUserProfile } from "../../features/profile/hooks/useUserProfile";

// Bundles the credit-points badge (a ScreenHeader trigger) with the
// dialog it opens, plus the userProfile fetch and open/close state
// both need. Previously this whole block — badge, dialog, state, and
// the userProfile.data?.credit_points ?? 0 read — was copy-pasted
// identically into 4 screens (Dashboard, Invoices, Clients, Products).
// Each screen only used useUserProfile() for this widget, so the
// fetch moves in here too rather than staying threaded through props;
// TanStack Query dedupes by query key, so mounting this in 4 places
// still costs one request, not 4.
export function CreditPointsWidget() {
  const userProfile = useUserProfile();
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

  return (
    <>
      <CreditBadge
        points={userProfile.data?.credit_points ?? 0}
        onClick={() => setIsCreditModalOpen(true)}
      />

      <CreditPointsDialog
        visible={isCreditModalOpen}
        points={userProfile.data?.credit_points ?? 0}
        onDismiss={() => setIsCreditModalOpen(false)}
        referralCode={userProfile.data?.referral_code}
      />
    </>
  );
}

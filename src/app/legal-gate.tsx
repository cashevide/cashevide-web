import { type PropsWithChildren } from "react";

import { useAuthStore } from "../stores/authStore";
import { usePendingAgreements } from "../features/legal/hooks/usePendingAgreements";
import { PendingAgreementsModal } from "../features/legal/components/PendingAgreementsModal";
import { Spinner } from "../components/ui/Spinner";

export function LegalGate({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { hasPendingAgreements, pendingLegalDocs, isLoading } =
    usePendingAgreements({ enabled: isAuthenticated });

  if (isAuthenticated && isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {children}

      <PendingAgreementsModal
        visible={isAuthenticated && hasPendingAgreements}
        pendingLegalDocs={pendingLegalDocs}
      />
    </>
  );
}

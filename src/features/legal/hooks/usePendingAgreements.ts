import { useUserProfile } from "../../profile/hooks/useUserProfile";

export function usePendingAgreements(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;

  const profileQuery = useUserProfile({ enabled });

  return {
    hasPendingAgreements: profileQuery.data?.has_pending_agreements ?? false,
    pendingLegalDocs: profileQuery.data?.pending_legal_docs ?? [],
    isLoading: profileQuery.isLoading,
  };
}

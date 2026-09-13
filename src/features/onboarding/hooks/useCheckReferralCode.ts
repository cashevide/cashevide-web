import { useQuery } from "@tanstack/react-query";

import { checkReferralCodeApi } from "../api/checkReferralCodeApi";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

import type { CheckReferralCodeResponse } from "../types/availabilityTypes";

const MIN_CODE_LENGTH = 3;

export function useCheckReferralCode(code: string) {
  const debouncedCode = useDebouncedValue(code, 500);

  const trimmedCode = debouncedCode.trim();

  const isEnabled = trimmedCode.length >= MIN_CODE_LENGTH;

  return useQuery<CheckReferralCodeResponse, Error>({
    queryKey: ["checkReferralCode", trimmedCode],
    queryFn: () => checkReferralCodeApi({ code: trimmedCode }),
    enabled: isEnabled,
  });
}

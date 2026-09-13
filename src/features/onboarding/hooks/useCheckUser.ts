import { useQuery } from "@tanstack/react-query";

import { checkUserApi } from "../api/checkUserApi";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

import type {
  CheckUserField,
  CheckUserResponse,
} from "../types/availabilityTypes";

const MIN_VALUE_LENGTH = 3;

export function useCheckUser(field: CheckUserField, value: string) {
  const debouncedValue = useDebouncedValue(value, 500);

  const trimmedValue = debouncedValue.trim();

  const isEnabled = trimmedValue.length >= MIN_VALUE_LENGTH;

  return useQuery<CheckUserResponse, Error>({
    queryKey: ["checkUser", field, trimmedValue],
    queryFn: () => checkUserApi({ field, value: trimmedValue }),
    enabled: isEnabled,
  });
}

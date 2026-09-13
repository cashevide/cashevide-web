import { useMutation } from "@tanstack/react-query";

import { refreshTokenApi } from "../api/tokenApi";

export function useRefreshToken() {
  return useMutation<void, Error, void>({
    mutationFn: refreshTokenApi,
  });
}

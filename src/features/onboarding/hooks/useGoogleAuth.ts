import type { CredentialResponse } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { googleAuthApi } from "../api/googleAuthApi";
import { useAuthStore } from "../../../stores/authStore";
import { ROUTES } from "../../../lib/routes";

import type {
  GoogleAuthRequest,
  GoogleAuthResponse,
} from "../types/googleAuthTypes";

type GoogleAuthMutationPayload = Omit<GoogleAuthRequest, "platform">;

type UseGoogleAuthOptions = {
  onPromptReferral?: (email: string, fullName: string) => void;
};

export function useGoogleAuth(options: UseGoogleAuthOptions = {}) {
  const { onPromptReferral } = options;

  const navigate = useNavigate();

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const googleAuthMutation = useMutation<
    GoogleAuthResponse,
    Error,
    GoogleAuthMutationPayload
  >({
    mutationFn: (payload) => googleAuthApi(payload),
    onSuccess: (data) => {
      if ("status" in data && data.status === "prompt_referral") {
        onPromptReferral?.(data.email, data.full_name);
        navigate(ROUTES.signup.google.referral);
        return;
      }

      setAuthenticated(true);
      navigate(ROUTES.home, { replace: true });
    },
  });

  function handleGoogleCredential(credentialResponse: CredentialResponse) {
    if (!credentialResponse.credential) {
      return;
    }

    googleAuthMutation.mutate({
      google_id_token: credentialResponse.credential,
    });
  }

  return {
    handleGoogleCredential,
    submitGoogleSignup: googleAuthMutation.mutate,
    isPending: googleAuthMutation.isPending,
    error: googleAuthMutation.error,
  };
}

import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";

import { googleAuthApi } from "../api/googleAuthApi";
import { useAuthStore } from "../../../stores/authStore";
import { useGoogleAuthStore } from "../../../stores/googleAuthStore";
import { ROUTES } from "../../../lib/routes";

import type {
  GoogleAuthRequest,
  GoogleAuthResponse,
} from "../types/googleAuthTypes";

type GoogleAuthMutationPayload = Omit<GoogleAuthRequest, "platform">;

export function useGoogleAuth() {
  const navigate = useNavigate();
  // Reads whatever ?referral= is on the current URL (set on the
  // Welcome screen when the person arrived via a referral deep link)
  // so it can be forwarded on to the Google referral step below —
  // Google sign-in doesn't go through a click on a link with its own
  // href, so there's no other place to carry this value across.
  const [searchParams] = useSearchParams();

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setGoogleIdToken = useGoogleAuthStore(
    (state) => state.setGoogleIdToken,
  );
  const setProfileInfo = useGoogleAuthStore((state) => state.setProfileInfo);

  const googleAuthMutation = useMutation<
    GoogleAuthResponse,
    Error,
    GoogleAuthMutationPayload
  >({
    mutationFn: (payload) => googleAuthApi(payload),
    onSuccess: (data) => {
      if ("status" in data && data.status === "prompt_referral") {
        setProfileInfo(data.email, data.full_name);

        const referralCode = searchParams.get("referral");
        navigate(
          referralCode
            ? `${ROUTES.signup.google.referral}?referral=${encodeURIComponent(referralCode)}`
            : ROUTES.signup.google.referral,
        );
        return;
      }

      setAuthenticated(true);
      navigate(ROUTES.home, { replace: true });
    },
  });

  function handleGoogleCredential(credentialResponse: { credential?: string }) {
    if (!credentialResponse.credential) {
      return;
    }

    setGoogleIdToken(credentialResponse.credential);
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

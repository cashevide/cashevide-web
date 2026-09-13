import { useState } from "react";
import type { AxiosError } from "axios";

import { Container } from "../../../components/layout/Container";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Spinner } from "../../../components/ui/Spinner";
import { useCheckUser } from "../hooks/useCheckUser";
import { useGoogleAuth } from "../../auth/hooks/useGoogleAuth";
import { useGoogleAuthStore } from "../../../stores/googleAuthStore";

import type { GoogleAuthError } from "../../auth/types/googleAuthTypes";

export function GoogleUsernameContent() {
  const [username, setUsername] = useState("");

  const googleIdToken = useGoogleAuthStore((state) => state.googleIdToken);
  const referralCodeInput = useGoogleAuthStore(
    (state) => state.referralCodeInput,
  );

  const usernameCheck = useCheckUser("username", username);

  const { submitGoogleSignup, isPending, error } = useGoogleAuth();

  function handleCreateAccount() {
    submitGoogleSignup({
      google_id_token: googleIdToken,
      referral_code_input: referralCodeInput,
      username: username.trim(),
    });
  }

  const isUsernameAvailable = usernameCheck.data?.is_available === true;

  const googleAuthError = error as AxiosError<GoogleAuthError> | null;

  const errorMessages = googleAuthError?.response?.data
    ? Object.values(googleAuthError.response.data).flat()
    : [];

  const usernameMessage = usernameCheck.data
    ? {
        text: usernameCheck.data.is_available
          ? "Username is available."
          : "This username is already taken.",
        isSuccess: usernameCheck.data.is_available,
      }
    : null;

  if (isPending) {
    return (
      <Container variant="narrow">
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      </Container>
    );
  }

  return (
    <Container variant="narrow" scroll>
      <div className="flex-1 flex flex-col justify-center px-6 py-10 gap-8">
        <Text variant="subheading" className="text-center">
          Choose a username
        </Text>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              isSuccess={usernameMessage?.isSuccess}
              error={
                (usernameMessage && !usernameMessage.isSuccess
                  ? usernameMessage.text
                  : undefined) ?? errorMessages[0]
              }
            />

            {usernameCheck.isFetching ? (
              <div className="flex items-center justify-center">
                <Spinner size="sm" />
              </div>
            ) : null}

            {usernameMessage?.isSuccess ? (
              <Text variant="body-sm" className="text-success-text text-center">
                {usernameMessage.text}
              </Text>
            ) : null}
          </div>

          <div className="flex items-center justify-center">
            <Button
              variant="primary"
              title="Create Google Account"
              onClick={handleCreateAccount}
              disabled={!isUsernameAvailable}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

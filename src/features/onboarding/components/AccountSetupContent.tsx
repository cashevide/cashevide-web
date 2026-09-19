import { useState } from "react";
import type { AxiosError } from "axios";

import { Container } from "../../../components/layout/Container";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Spinner } from "../../../components/ui/Spinner";
import { useCheckUser } from "../hooks/useCheckUser";
import { useSignup } from "../hooks/useSignup";
import { useSignupStore } from "../../../stores/signupStore";

import type { SignupError } from "../types/signupTypes";

export function AccountSetupContent() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const email = useSignupStore((state) => state.email);
  const referralCodeInput = useSignupStore((state) => state.referralCodeInput);

  const usernameCheck = useCheckUser("username", username);

  const signupMutation = useSignup();

  function handleCreateAccount() {
    signupMutation.mutate({
      email,
      username: username.trim(),
      full_name: fullName.trim(),
      password,
      referral_code_input: referralCodeInput,
    });
  }

  const isUsernameAvailable = usernameCheck.data?.is_available === true;

  const canSubmit =
    isUsernameAvailable && fullName.trim().length > 0 && password.length > 0;

  const signupError = signupMutation.error as AxiosError<SignupError> | null;

  const signupErrorMessages = signupError?.response?.data
    ? Object.values(signupError.response.data).flat()
    : [];

  const usernameMessage = usernameCheck.data
    ? {
        text: usernameCheck.data.is_available
          ? "Username is available."
          : "This username is already taken.",
        isSuccess: usernameCheck.data.is_available,
      }
    : null;

  return (
    <Container variant="narrow" scroll>
      <div className="flex-1 flex flex-col justify-center px-6 py-10 gap-8">
        <Text variant="subheading" className="text-center">
          Set up your account
        </Text>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              isSuccess={usernameMessage?.isSuccess}
              error={
                usernameMessage && !usernameMessage.isSuccess
                  ? usernameMessage.text
                  : undefined
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

          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
          />

          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSubmit) {
                handleCreateAccount();
              }
            }}
            placeholder="Password"
            isPassword
            error={signupErrorMessages[0]}
          />

          <div className="flex items-center justify-center">
            <Button
              variant="primary"
              title="Create Account"
              onClick={handleCreateAccount}
              disabled={!canSubmit}
              isLoading={signupMutation.isPending}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

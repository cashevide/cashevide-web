import { useState } from "react";
import type { AxiosError } from "axios";

import { Container } from "../../../components/layout/Container";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useResetPassword } from "../hooks/useResetPassword";
import { usePasswordResetStore } from "../../../stores/passwordResetStore";

import type { ResetPasswordError } from "../types/passwordResetTypes";

export function ResetPasswordContent() {
  const [newPassword, setNewPassword] = useState("");

  const email = usePasswordResetStore((state) => state.email);

  const resetPasswordMutation = useResetPassword();

  function handleResetPassword() {
    resetPasswordMutation.mutate({
      email,
      new_password: newPassword,
    });
  }

  const resetPasswordError =
    resetPasswordMutation.error as AxiosError<ResetPasswordError> | null;

  const errorMessages = resetPasswordError?.response?.data
    ? Object.values(resetPasswordError.response.data).flat()
    : [];

  return (
    <Container variant="narrow" scroll>
      <div className="flex-1 flex flex-col justify-center px-6 py-10 gap-8">
        <Text variant="subheading" className="text-center">
          Set a new password
        </Text>

        <div className="flex flex-col gap-4">
          <Input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            isPassword
            error={errorMessages[0]}
          />

          <div className="flex items-center justify-center">
            <Button
              variant="primary"
              title="Reset Password"
              onClick={handleResetPassword}
              disabled={newPassword.length === 0}
              isLoading={resetPasswordMutation.isPending}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

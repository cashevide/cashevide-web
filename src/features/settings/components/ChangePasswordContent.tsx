import { useState } from "react";

import { useChangePassword } from "../hooks/useChangePassword";
import { useUserProfile } from "../../profile/hooks/useUserProfile";
import { getFieldErrorMessage } from "../../../lib/api/errors";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";

export function ChangePasswordContent() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const profileQuery = useUserProfile();
  const changePasswordMutation = useChangePassword();

  const hasPassword = profileQuery.data?.has_password ?? true;

  function handleChangePassword() {
    changePasswordMutation.mutate({
      current_password: hasPassword ? currentPassword : undefined,
      new_password: newPassword,
    });
  }

  const errorMessage = changePasswordMutation.isError
    ? getFieldErrorMessage(changePasswordMutation.error)
    : undefined;

  const canSubmit =
    (!hasPassword || currentPassword.length > 0) && newPassword.length > 0;

  if (profileQuery.isLoading) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
        <ScreenHeader
          title="Change Password"
          showBackButton
          showCreditPoints={false}
        />
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader
        title="Change Password"
        showBackButton
        showCreditPoints={false}
      />

      <Container variant="narrow" scroll>
        <div className="flex flex-1 flex-col justify-center px-6 py-10 gap-8">
          <Text variant="subheading" className="text-center">
            {hasPassword ? "Change your password" : "Set a password"}
          </Text>

          <div className="flex flex-col gap-4">
            {hasPassword && (
              <Input
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                isPassword
              />
            )}

            <Input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSubmit) {
                  handleChangePassword();
                }
              }}
              placeholder="New Password"
              isPassword
              error={errorMessage}
            />

            {/* justify-center (not items-center, which only controls
                cross-axis alignment and does nothing for a single
                child in a row) — this is what actually centers the
                button horizontally in the row. */}
            <div className="flex justify-center">
              <Button
                variant="primary"
                title={hasPassword ? "Change Password" : "Set Password"}
                onClick={handleChangePassword}
                disabled={!canSubmit}
                isLoading={changePasswordMutation.isPending}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

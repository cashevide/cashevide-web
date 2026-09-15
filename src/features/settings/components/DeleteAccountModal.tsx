import { useState } from "react";

import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Spinner } from "../../../components/ui/Spinner";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { Modal } from "../../../components/ui/Modal";
import { useDeleteAccount } from "../hooks/useDeleteAccount";

type DeleteAccountModalProps = {
  visible: boolean;
  username: string;
  onDismiss: () => void;
};

type Step = "confirm" | "typeUsername";

export function DeleteAccountModal({
  visible,
  username,
  onDismiss,
}: DeleteAccountModalProps) {
  const [step, setStep] = useState<Step>("confirm");
  const [typedUsername, setTypedUsername] = useState("");
  const deleteAccountMutation = useDeleteAccount();

  function handleClose() {
    setStep("confirm");
    setTypedUsername("");
    onDismiss();
  }

  function handleConfirmYes() {
    setStep("typeUsername");
  }

  function handleDelete() {
    deleteAccountMutation.mutate();
  }

  const isUsernameMatching =
    typedUsername.trim() === username && username.length > 0;

  if (step === "confirm") {
    return (
      <ConfirmDialog
        visible={visible}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmLabel="Yes"
        cancelLabel="No"
        destructive
        onConfirm={handleConfirmYes}
        onCancel={handleClose}
      />
    );
  }

  return (
    <Modal
      visible={visible}
      dismissible
      onDismiss={handleClose}
      title="Confirm Deletion"
      description={
        <Text variant="body-sm">
          This will permanently delete your account and all associated data.
          Type your username{" "}
          <Text as="span" variant="body-sm" className="font-semibold">
            {username}
          </Text>{" "}
          to confirm.
        </Text>
      }
      footer={
        <div className="flex flex-row justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            title="Cancel"
            onClick={handleClose}
            disabled={deleteAccountMutation.isPending}
          />

          {deleteAccountMutation.isPending ? (
            <Spinner size="sm" />
          ) : (
            <Button
              variant="destructive"
              size="sm"
              title="Confirm Delete"
              onClick={handleDelete}
              disabled={!isUsernameMatching}
            />
          )}
        </div>
      }
    >
      <Input
        value={typedUsername}
        onChange={(e) => setTypedUsername(e.target.value)}
        placeholder="Type your username"
        autoCapitalize="none"
        error={
          deleteAccountMutation.isError
            ? "Could not delete your account. Please try again."
            : undefined
        }
      />
    </Modal>
  );
}

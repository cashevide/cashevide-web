import type { ReactNode } from "react";

import { Button } from "./Button";
import { Modal } from "./Modal";
import { Text } from "./Text";

type InfoDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  icon?: ReactNode;
  buttonLabel?: string;
  onDismiss: () => void;
};

export function InfoDialog({
  visible,
  title,
  message,
  icon,
  buttonLabel = "OK",
  onDismiss,
}: InfoDialogProps) {
  return (
    <Modal
      visible={visible}
      dismissible
      onDismiss={onDismiss}
      footer={
        <div className="flex flex-row justify-end">
          <Button
            variant="primary"
            size="sm"
            title={buttonLabel}
            onClick={onDismiss}
          />
        </div>
      }
    >
      <div className="flex flex-col items-center gap-3 text-center">
        {icon}
        <Text variant="subheading">{title}</Text>
        <Text variant="body-sm" className="text-muted-foreground">
          {message}
        </Text>
      </div>
    </Modal>
  );
}

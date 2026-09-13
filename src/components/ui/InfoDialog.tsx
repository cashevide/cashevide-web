import { Button } from "./Button";
import { Modal } from "./Modal";

type InfoDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  buttonLabel?: string;
  onDismiss: () => void;
};

export function InfoDialog({
  visible,
  title,
  message,
  buttonLabel = "OK",
  onDismiss,
}: InfoDialogProps) {
  return (
    <Modal
      visible={visible}
      dismissible
      onDismiss={onDismiss}
      title={title}
      description={message}
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
    />
  );
}

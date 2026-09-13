import { useState } from "react";

import { Container } from "../../../../../components/layout/Container";
import { Text } from "../../../../../components/ui/Text";
import { Button } from "../../../../../components/ui/Button";
import { Modal } from "../../../../../components/ui/Modal";
import { ConfirmDialog } from "../../../../../components/ui/ConfirmDialog";
import { InfoDialog } from "../../../../../components/ui/InfoDialog";

const LOREM_PARAGRAPHS = Array.from({ length: 8 }, (_, i) => i);

export function ModalRoute() {
  const [basicVisible, setBasicVisible] = useState(false);
  const [nonDismissibleVisible, setNonDismissibleVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [destructiveConfirmVisible, setDestructiveConfirmVisible] =
    useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [stickyFooterVisible, setStickyFooterVisible] = useState(false);
  const [scrollableVisible, setScrollableVisible] = useState(false);

  function handleDestructiveConfirm() {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      setDestructiveConfirmVisible(false);
    }, 1500);
  }

  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-10 py-12 px-6">
        <Text variant="title">Modal</Text>

        <div className="flex flex-row flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            title="Basic"
            onClick={() => setBasicVisible(true)}
          />
          <Button
            variant="outline"
            size="sm"
            title="Non-dismissible"
            onClick={() => setNonDismissibleVisible(true)}
          />
          <Button
            variant="outline"
            size="sm"
            title="With Footer"
            onClick={() => setFooterVisible(true)}
          />
          <Button
            variant="outline"
            size="sm"
            title="Scrollable Content"
            onClick={() => setScrollableVisible(true)}
          />
          <Button
            variant="outline"
            size="sm"
            title="Sticky Footer"
            onClick={() => setStickyFooterVisible(true)}
          />
          <Button
            variant="outline"
            size="sm"
            title="Confirm Dialog"
            onClick={() => setConfirmVisible(true)}
          />
          <Button
            variant="outline"
            size="sm"
            title="Destructive Confirm"
            onClick={() => setDestructiveConfirmVisible(true)}
          />
          <Button
            variant="outline"
            size="sm"
            title="Info Dialog"
            onClick={() => setInfoVisible(true)}
          />
        </div>
      </div>

      <Modal
        visible={basicVisible}
        onDismiss={() => setBasicVisible(false)}
        title="Basic Modal"
        description="Click the backdrop to dismiss."
      />

      <Modal
        visible={nonDismissibleVisible}
        dismissible={false}
        title="Non-dismissible Modal"
        description="Can only be closed using the button below."
        footer={
          <Button
            variant="primary"
            size="sm"
            title="Close"
            onClick={() => setNonDismissibleVisible(false)}
          />
        }
      />

      <Modal
        visible={footerVisible}
        onDismiss={() => setFooterVisible(false)}
        title="Confirm Deletion"
        description="This action cannot be undone. Are you sure you want to continue?"
        footer={
          <div className="flex flex-row justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              title="Cancel"
              onClick={() => setFooterVisible(false)}
            />
            <Button
              variant="destructive"
              size="sm"
              title="Delete"
              onClick={() => setFooterVisible(false)}
            />
          </div>
        }
      />

      <Modal
        visible={scrollableVisible}
        onDismiss={() => setScrollableVisible(false)}
        title="Terms and Conditions"
        description="Please review the full text below."
      >
        <div className="max-h-[280px] overflow-y-auto">
          <div className="flex flex-col gap-3">
            {LOREM_PARAGRAPHS.map((i) => (
              <Text key={i} variant="body-sm">
                Section {i + 1}. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </Text>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        visible={stickyFooterVisible}
        onDismiss={() => setStickyFooterVisible(false)}
        title="Updated Terms & Privacy Policy"
        description="We have updated our legal documents. Please review and accept to continue."
        footer={
          <div className="flex flex-row justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              title="Decline"
              onClick={() => setStickyFooterVisible(false)}
            />
            <Button
              variant="primary"
              size="sm"
              title="Accept & Continue"
              onClick={() => setStickyFooterVisible(false)}
            />
          </div>
        }
      >
        <div className="max-h-[220px] overflow-y-auto">
          <div className="flex flex-col gap-3">
            {LOREM_PARAGRAPHS.map((i) => (
              <Text key={i} variant="body-sm">
                Section {i + 1}. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </Text>
            ))}
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        visible={confirmVisible}
        title="Log out?"
        message="You will need to sign in again to access your account."
        confirmLabel="Log out"
        onConfirm={() => setConfirmVisible(false)}
        onCancel={() => setConfirmVisible(false)}
      />

      <ConfirmDialog
        visible={destructiveConfirmVisible}
        title="Delete client"
        message="This will permanently remove this client and cannot be undone."
        confirmLabel="Delete"
        destructive
        isConfirming={isConfirming}
        onConfirm={handleDestructiveConfirm}
        onCancel={() => setDestructiveConfirmVisible(false)}
      />

      <InfoDialog
        visible={infoVisible}
        title="Upgrade required"
        message="You've reached the free plan limit for clients. Upgrade to add more."
        onDismiss={() => setInfoVisible(false)}
      />
    </Container>
  );
}

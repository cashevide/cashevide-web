import { useState } from "react";
import { IdCard, User, Mail } from "lucide-react";

import { useUserProfile } from "../../profile/hooks/useUserProfile";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
import { InfoListRow } from "../../../components/ui/InfoListRow";

export function AccountSettingsContent() {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const profileQuery = useUserProfile();

  if (profileQuery.isLoading) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
        <ScreenHeader title="Account" showBackButton />
        <Container variant="desktop">
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader title="Account" showBackButton />

      <Container variant="desktop" scroll>
        <div className="w-full max-w-narrow mx-auto px-6 py-6 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-lg px-4">
            <InfoListRow
              icon={IdCard}
              label="Username"
              value={profileQuery.data?.username}
            />
            <InfoListRow
              icon={User}
              label="Full Name"
              value={profileQuery.data?.full_name}
            />
            <InfoListRow
              icon={Mail}
              label="Email"
              value={profileQuery.data?.email}
              isLast
            />
          </div>

          <Button
            variant="destructive"
            title="Delete Account"
            onClick={() => setIsDeleteModalVisible(true)}
          />
        </div>
      </Container>

      <DeleteAccountModal
        visible={isDeleteModalVisible}
        username={profileQuery.data?.username ?? ""}
        onDismiss={() => setIsDeleteModalVisible(false)}
      />
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Briefcase, Phone, Sparkles, IdCard, Gift } from "lucide-react";

import { ProfileSubTabs } from "../components/ProfileSubTabs";
import { useUserProfile } from "../hooks/useUserProfile";
import { useUpdateUserProfile } from "../hooks/useUpdateUserProfile";
import { ROUTES } from "../../../lib/routes";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
import { AvatarPicker } from "../../../components/ui/AvatarPicker";
import { InfoListRow } from "../../../components/ui/InfoListRow";

export function ProfileContent() {
  const navigate = useNavigate();
  const userProfile = useUserProfile();
  const updateUserProfile = useUpdateUserProfile();
  const [justCopied, setJustCopied] = useState(false);

  async function handleCopyReferralCode() {
    if (!userProfile.data?.referral_code) {
      return;
    }

    await navigator.clipboard.writeText(userProfile.data.referral_code);
    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 2000);
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader title="Profile" containerVariant="desktop" />

      <Container variant="desktop" scroll>
        <div className="w-full max-w-narrow mx-auto px-6 py-6 flex flex-col gap-6">
          <ProfileSubTabs />

          {userProfile.isLoading ? (
            <div className="flex flex-1 items-center justify-center py-16">
              <Spinner />
            </div>
          ) : (
            userProfile.data && (
              <>
                <div className="flex flex-col items-center gap-3">
                  <AvatarPicker
                    imageUri={userProfile.data.profile_picture}
                    onPick={(file) => {
                      updateUserProfile.mutate({ profile_picture: file });
                    }}
                    onRemove={() => {
                      updateUserProfile.mutate({ profile_picture: null });
                    }}
                    isUploading={updateUserProfile.isPending}
                    isError={updateUserProfile.isError}
                    shape="circle"
                    placeholderText="Add Photo"
                    size={112}
                  />

                  <Text variant="heading" className="text-center">
                    {userProfile.data.full_name}
                  </Text>
                </div>

                <div className="bg-card border border-border rounded-lg px-4">
                  <InfoListRow
                    icon={Mail}
                    label="Email"
                    value={userProfile.data.email}
                  />
                  <InfoListRow
                    icon={IdCard}
                    label="Username"
                    value={userProfile.data.username}
                  />
                  <InfoListRow
                    icon={Briefcase}
                    label="Job Title"
                    value={userProfile.data.job_title}
                  />
                  <InfoListRow
                    icon={Phone}
                    label="Phone"
                    value={userProfile.data.phone_number}
                  />
                  <InfoListRow
                    icon={Sparkles}
                    label="Credit Points"
                    value={String(userProfile.data.credit_points)}
                  />
                  <InfoListRow
                    icon={Gift}
                    label="Referral Code"
                    value={
                      justCopied ? "Copied!" : userProfile.data.referral_code
                    }
                    onCopy={handleCopyReferralCode}
                    isLast
                  />
                </div>

                <Button
                  variant="primary"
                  title="Edit Personal Profile"
                  onClick={() => navigate(ROUTES.profile.edit)}
                />
              </>
            )
          )}
        </div>
      </Container>
    </div>
  );
}

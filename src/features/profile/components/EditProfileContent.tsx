import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useUserProfile } from "../hooks/useUserProfile";
import { useUpdateUserProfile } from "../hooks/useUpdateUserProfile";
import { getFieldErrorMessage } from "../../../lib/api/errors";
import { ROUTES } from "../../../lib/routes";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";

export function EditProfileContent() {
  const navigate = useNavigate();
  const userProfile = useUserProfile();
  const updateUserProfile = useUpdateUserProfile();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    if (userProfile.data) {
      setFullName(userProfile.data.full_name);
      setPhoneNumber(userProfile.data.phone_number);
      setJobTitle(userProfile.data.job_title);
    }
  }, [userProfile.data]);

  function handleSave() {
    updateUserProfile.mutate(
      {
        full_name: fullName,
        phone_number: phoneNumber,
        job_title: jobTitle,
      },
      {
        onSuccess: () => {
          navigate(ROUTES.profile.home, { replace: true });
        },
      },
    );
  }

  const errorMessage = updateUserProfile.isError
    ? getFieldErrorMessage(updateUserProfile.error)
    : null;

  if (userProfile.isLoading) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
        <ScreenHeader
          title="Edit Profile"
          showBackButton
          containerVariant="narrow"
        />
        <Container variant="narrow">
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader
        title="Edit Profile"
        showBackButton
        containerVariant="narrow"
      />

      <Container variant="narrow" scroll>
        <div className="flex flex-col gap-4 px-6 py-6">
          <Input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <Input
            placeholder="Phone Number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <Input
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />

          {errorMessage && (
            <Text variant="body-sm" className="text-center text-destructive">
              {errorMessage}
            </Text>
          )}

          <Button
            variant="primary"
            title="Save"
            onClick={handleSave}
            disabled={!fullName.trim()}
            isLoading={updateUserProfile.isPending}
          />
        </div>
      </Container>
    </div>
  );
}

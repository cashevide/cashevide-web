import { useNavigate } from "react-router";
import { MapPin, Phone, Mail, Globe, IndianRupee, IdCard } from "lucide-react";

import { ProfileSubTabs } from "../../profile/components/ProfileSubTabs";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { useUpdateBusinessProfile } from "../hooks/useUpdateBusinessProfile";
import { ROUTES } from "../../../lib/routes";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
import { AvatarPicker } from "../../../components/ui/AvatarPicker";
import { InfoListRow } from "../../../components/ui/InfoListRow";

// Display-only — strips the protocol and any trailing slash so the
// info row reads "cashevide.com" instead of "https://cashevide.com/".
// The raw value (with protocol) is what's actually stored/edited; this
// never touches that, only what's shown here.
function formatWebsiteForDisplay(url?: string): string | undefined {
  if (!url) {
    return url;
  }

  return url.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}

export function BusinessProfileContent() {
  const navigate = useNavigate();
  const businessProfile = useBusinessProfile();
  const updateBusinessProfile = useUpdateBusinessProfile();

  // GST and VAT are both optional and country-dependent — a business
  // might have neither, one, or both. InfoListRow hides empty fields
  // itself, so which row ends up drawn last (and therefore shouldn't
  // have a bottom divider) isn't fixed; this finds the actual last
  // populated field each render instead of assuming it's always VAT.
  const lastFieldKey = businessProfile.data
    ? (
        [
          ["address", businessProfile.data.address],
          ["phone", businessProfile.data.phone_number],
          ["email", businessProfile.data.business_email],
          ["website", businessProfile.data.website],
          ["currency", businessProfile.data.currency],
          ["gst", businessProfile.data.gst_number],
          ["vat", businessProfile.data.vat_number],
        ] as const
      )
        .filter(([, value]) => !!value)
        .at(-1)?.[0]
    : undefined;

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader title="Business Profile" />

      <Container variant="desktop" scroll>
        <div className="w-full max-w-narrow mx-auto px-6 py-6 flex flex-col gap-6">
          <ProfileSubTabs />

          {businessProfile.isLoading ? (
            <div className="flex flex-1 items-center justify-center py-16">
              <Spinner />
            </div>
          ) : (
            businessProfile.data && (
              <>
                <div className="flex flex-col items-center gap-3">
                  <AvatarPicker
                    imageUri={businessProfile.data.logo}
                    onPick={(file) => {
                      updateBusinessProfile.mutate({ logo: file });
                    }}
                    onRemove={() => {
                      updateBusinessProfile.mutate({ logo: null });
                    }}
                    isUploading={updateBusinessProfile.isPending}
                    isError={updateBusinessProfile.isError}
                    shape="square"
                    placeholderText="Add Logo"
                    size={112}
                  />

                  <Text variant="heading" className="text-center">
                    {businessProfile.data.business_name ||
                      "Business name not set"}
                  </Text>
                </div>

                <div className="bg-card border border-border rounded-lg px-4">
                  <InfoListRow
                    icon={MapPin}
                    label="Address"
                    value={businessProfile.data.address}
                    isLast={lastFieldKey === "address"}
                  />
                  <InfoListRow
                    icon={Phone}
                    label="Phone"
                    value={businessProfile.data.phone_number}
                    isLast={lastFieldKey === "phone"}
                  />
                  <InfoListRow
                    icon={Mail}
                    label="Email"
                    value={businessProfile.data.business_email}
                    isLast={lastFieldKey === "email"}
                  />
                  <InfoListRow
                    icon={Globe}
                    label="Website"
                    value={formatWebsiteForDisplay(
                      businessProfile.data.website,
                    )}
                    isLast={lastFieldKey === "website"}
                  />
                  <InfoListRow
                    icon={IndianRupee}
                    label="Currency"
                    value={businessProfile.data.currency}
                    isLast={lastFieldKey === "currency"}
                  />
                  <InfoListRow
                    icon={IdCard}
                    label="GST Number"
                    value={businessProfile.data.gst_number}
                    isLast={lastFieldKey === "gst"}
                  />
                  <InfoListRow
                    icon={IdCard}
                    label="VAT Number"
                    value={businessProfile.data.vat_number}
                    isLast={lastFieldKey === "vat"}
                  />
                </div>

                <Button
                  variant="primary"
                  title="Edit Business Profile"
                  onClick={() => navigate(ROUTES.profile.businessEdit)}
                />
              </>
            )
          )}
        </div>
      </Container>
    </div>
  );
}

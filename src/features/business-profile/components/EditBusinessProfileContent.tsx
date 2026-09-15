import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { useUpdateBusinessProfile } from "../hooks/useUpdateBusinessProfile";
import { getFieldErrorMessage } from "../../../lib/api/errors";
import { ROUTES } from "../../../lib/routes";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
import { CurrencyPicker } from "../../../components/ui/CurrencyPicker";
import { AvatarPicker } from "../../../components/ui/AvatarPicker";

export function EditBusinessProfileContent() {
  const navigate = useNavigate();
  const businessProfile = useBusinessProfile();
  const updateBusinessProfile = useUpdateBusinessProfile();

  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [currency, setCurrency] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [vatNumber, setVatNumber] = useState("");

  // Logo is handled separately from the text fields — it is never
  // uploaded immediately on pick. It is only sent as part of the same
  // PATCH as everything else, when "Save" is pressed.
  // logoFile: a newly picked file staged for upload.
  // logoRemoved: user tapped "Remove Photo" — clear the logo on save.
  // Both stay in sync (picking a new photo cancels a pending removal,
  // and vice versa) so handleSave can trust a single source of truth.
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoRemoved, setLogoRemoved] = useState(false);

  // Logo is required for invoice generation, but unlike the text fields
  // above we don't disable the Save button for it — the button always
  // stays pressable, and this message only appears after a press with
  // no logo present. Cleared as soon as the user picks a photo.
  const [logoErrorMessage, setLogoErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (businessProfile.data) {
      setBusinessName(businessProfile.data.business_name);
      setAddress(businessProfile.data.address);
      setPhoneNumber(businessProfile.data.phone_number);
      setBusinessEmail(businessProfile.data.business_email);
      setWebsite(businessProfile.data.website);
      setCurrency(businessProfile.data.currency);
      setGstNumber(businessProfile.data.gst_number);
      setVatNumber(businessProfile.data.vat_number);
    }
  }, [businessProfile.data]);

  function handlePickLogo(file: File) {
    setLogoFile(file);
    setLogoRemoved(false);
    setLogoErrorMessage(null);
  }

  function handleRemoveLogo() {
    setLogoFile(null);
    setLogoRemoved(true);
  }

  function handleSave() {
    // Backend logo field is optional, but a logo is mandatory here
    // because invoices can't generate without one. This check runs
    // only on Save press — the button itself stays enabled so tapping
    // it is what surfaces the requirement, rather than a silently
    // disabled button the user has to guess the reason for.
    const willHaveLogo = logoRemoved
      ? false
      : !!(logoFile ?? businessProfile.data?.logo);

    if (!willHaveLogo) {
      setLogoErrorMessage("Business logo is required to generate invoices.");
      return;
    }

    updateBusinessProfile.mutate(
      {
        business_name: businessName,
        address,
        phone_number: phoneNumber,
        business_email: businessEmail,
        website,
        currency,
        gst_number: gstNumber,
        vat_number: vatNumber,
        // undefined (key omitted): logo unchanged.
        // logoFile: a new photo was picked — upload it.
        // null: "Remove Photo" was pressed — clear it on the server.
        ...(logoFile ? { logo: logoFile } : logoRemoved ? { logo: null } : {}),
      },
      {
        onSuccess: () => {
          navigate(ROUTES.profile.business, { replace: true });
        },
      },
    );
  }

  // logoErrorMessage takes priority — it reflects the most recent Save
  // attempt. Once it's set, the API error (from a prior attempt, if
  // any) is stale and shouldn't be shown alongside it.
  const errorMessage =
    logoErrorMessage ??
    (updateBusinessProfile.isError
      ? getFieldErrorMessage(updateBusinessProfile.error)
      : null);

  const canSubmit =
    businessName.trim().length > 0 &&
    address.trim().length > 0 &&
    phoneNumber.trim().length > 0 &&
    currency.trim().length > 0;

  if (businessProfile.isLoading) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
        <ScreenHeader
          title="Edit Business Profile"
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

  // The avatar preview is fully local/optimistic here: a picked photo
  // shows via a fresh object URL, a pending removal shows the
  // placeholder, and otherwise we fall back to the server's current
  // logo. None of this touches the network — AvatarPicker's
  // isUploading/isError stay tied to the single handleSave mutation,
  // not to picking itself.
  const logoPreviewUri = logoRemoved
    ? null
    : logoFile
      ? URL.createObjectURL(logoFile)
      : (businessProfile.data?.logo ?? null);

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader
        title="Edit Business Profile"
        showBackButton
        containerVariant="narrow"
      />

      <Container variant="narrow" scroll>
        <div className="flex flex-col gap-4 px-6 py-6">
          <div className="flex flex-col items-center pb-2">
            <AvatarPicker
              imageUri={logoPreviewUri}
              onPick={handlePickLogo}
              onRemove={handleRemoveLogo}
              shape="square"
              placeholderText="Add Logo"
            />
          </div>

          <Input
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />

          <Input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            multiline
          />

          <Input
            placeholder="Phone Number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <Input
            placeholder="Business Email (optional)"
            type="email"
            autoCapitalize="none"
            value={businessEmail}
            onChange={(e) => setBusinessEmail(e.target.value)}
          />

          <div className="flex flex-col gap-1">
            <Text variant="body-sm" className="text-muted-foreground">
              Currency
            </Text>
            <CurrencyPicker value={currency} onChange={setCurrency} />
          </div>

          <Input
            placeholder="Website (optional)"
            type="url"
            autoCapitalize="none"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />

          <Input
            placeholder="GST Number (optional)"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
          />

          <Input
            placeholder="VAT Number (optional)"
            value={vatNumber}
            onChange={(e) => setVatNumber(e.target.value)}
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
            disabled={!canSubmit}
            isLoading={updateBusinessProfile.isPending}
          />
        </div>
      </Container>
    </div>
  );
}

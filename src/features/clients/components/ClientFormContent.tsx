import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useClientDetails } from "../hooks/useClientDetails";
import { useCreateClient } from "../hooks/useCreateClient";
import { useUpdateClient } from "../hooks/useUpdateClient";
import { getFieldErrorMessage } from "../../../lib/api/errors";
import { ROUTES } from "../../../lib/routes";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
import { PhoneNumberInput } from "../../../components/ui/PhoneNumberInput";

export function ClientFormContent() {
  const navigate = useNavigate();
  const { slug: clientSlug } = useParams<{ slug?: string }>();
  const isEditMode = Boolean(clientSlug);

  const clientDetails = useClientDetails(clientSlug ?? "");
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (isEditMode && clientDetails.data) {
      setName(clientDetails.data.name);
      setEmail(clientDetails.data.email);
      setPhone(clientDetails.data.phone);
      setAddress(clientDetails.data.address);
    }
  }, [isEditMode, clientDetails.data]);

  const mutation = isEditMode ? updateClient : createClient;
  const errorMessage = mutation.isError
    ? getFieldErrorMessage(mutation.error)
    : null;

  function handleSave() {
    if (isEditMode && clientSlug) {
      updateClient.mutate(
        {
          slug: clientSlug,
          payload: { name, email, phone, address },
        },
        {
          onSuccess: (data) => {
            navigate(ROUTES.invoices.clients.detail(data.slug), {
              replace: true,
            });
          },
        },
      );
      return;
    }

    createClient.mutate(
      { name, email, phone, address },
      {
        onSuccess: (data) => {
          navigate(ROUTES.invoices.clients.detail(data.slug), {
            replace: true,
          });
        },
      },
    );
  }

  if (isEditMode && clientDetails.isLoading) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
        <ScreenHeader
          title="Edit Client"
          showBackButton
          containerVariant="desktop"
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
        title={isEditMode ? "Edit Client" : "Add Client"}
        showBackButton
        containerVariant="desktop"
      />

      <Container variant="narrow" scroll>
        <div className="flex flex-col gap-4 px-6 py-6">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <PhoneNumberInput
            onChangeFullNumber={setPhone}
            initialValue={isEditMode ? clientDetails.data?.phone : undefined}
          />

          <Input
            placeholder="Email (optional)"
            type="email"
            autoCapitalize="none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Address (optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            multiline
          />

          {errorMessage && (
            <Text variant="body-sm" className="text-center text-destructive">
              {errorMessage}
            </Text>
          )}

          <Button
            variant="primary"
            title={isEditMode ? "Save Changes" : "Create Client"}
            onClick={handleSave}
            disabled={!name.trim() || !phone.trim()}
            isLoading={mutation.isPending}
          />
        </div>
      </Container>
    </div>
  );
}

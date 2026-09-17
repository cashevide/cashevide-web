import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Mail, Phone, MapPin } from "lucide-react";

import { useClientDetails } from "../hooks/useClientDetails";
import { useDeleteClient } from "../hooks/useDeleteClient";
import { useUpdateClient } from "../hooks/useUpdateClient";
import { getFieldErrorMessage } from "../../../lib/api/errors";
import { ROUTES } from "../../../lib/routes";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Avatar } from "../../../components/ui/Avatar";
import { Badge } from "../../../components/ui/Badge";
import { Spinner } from "../../../components/ui/Spinner";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { InfoDialog } from "../../../components/ui/InfoDialog";
import { InfoListRow } from "../../../components/ui/InfoListRow";

export function ClientDetailsContent() {
  const navigate = useNavigate();
  const { slug: clientSlug } = useParams<{ slug: string }>();
  const [limitErrorMessage, setLimitErrorMessage] = useState<string | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const clientDetails = useClientDetails(clientSlug ?? "");
  const deleteClient = useDeleteClient();
  const updateClient = useUpdateClient();

  // Refetch on mount only, matching the established pattern (see
  // InvoiceDetailsContent.tsx for why: no focus-lifecycle event in
  // React Router).
  useEffect(() => {
    if (clientSlug) {
      clientDetails.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSlug]);

  function handleConfirmDelete() {
    if (!clientSlug) return;
    deleteClient.mutate(clientSlug, {
      onSuccess: () => {
        navigate(ROUTES.invoices.clients.list, { replace: true });
      },
    });
  }

  function handleArchive() {
    if (!clientSlug) return;
    updateClient.mutate({ slug: clientSlug, payload: { is_archived: true } });
  }

  function handleUnarchive() {
    if (!clientSlug) return;
    updateClient.mutate(
      { slug: clientSlug, payload: { is_archived: false } },
      {
        onError: (error) => {
          setLimitErrorMessage(getFieldErrorMessage(error));
        },
      },
    );
  }

  if (clientDetails.isLoading) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
        <ScreenHeader title="Client" showBackButton />
        <Container variant="narrow">
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        </Container>
      </div>
    );
  }

  if (clientDetails.isError) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
        <ScreenHeader title="Client" showBackButton />
        <Container variant="narrow">
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <Text variant="body" className="text-muted-foreground">
              Client not found.
            </Text>
            <Button
              variant="outline"
              title="Back to Clients"
              onClick={() =>
                navigate(ROUTES.invoices.clients.list, { replace: true })
              }
            />
          </div>
        </Container>
      </div>
    );
  }

  const client = clientDetails.data;
  const isArchived = client?.is_archived ?? false;

  // Email, phone, and address are all optional — a client could have
  // any subset of them, so which row ends up last (and therefore
  // shouldn't draw a bottom divider) isn't fixed. This finds whichever
  // populated field is actually last, same approach as Business
  // Profile's GST/VAT handling.
  const lastFieldKey = client
    ? (
        [
          ["email", client.email],
          ["phone", client.phone],
          ["address", client.address],
        ] as const
      )
        .filter(([, value]) => !!value)
        .at(-1)?.[0]
    : undefined;

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader title="Client" showBackButton />

      <Container variant="narrow" scroll>
        <div className="flex flex-col gap-6 px-6 py-6">
          <div className="flex flex-col items-center gap-3">
            <Avatar name={client?.name} size={72} />

            <div className="flex flex-col items-center gap-1">
              <Text variant="heading">{client?.name}</Text>
              {isArchived && <Badge label="Archived" variant="default" />}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg px-4">
            <InfoListRow
              icon={Mail}
              label="Email"
              value={client?.email}
              isLast={lastFieldKey === "email"}
            />
            <InfoListRow
              icon={Phone}
              label="Phone"
              value={client?.phone}
              isLast={lastFieldKey === "phone"}
            />
            <InfoListRow
              icon={MapPin}
              label="Address"
              value={client?.address}
              isLast={lastFieldKey === "address"}
            />
          </div>

          <div className="flex flex-col gap-3">
            {!isArchived && clientSlug && (
              <Button
                variant="primary"
                title="Edit Client"
                onClick={() =>
                  navigate(ROUTES.invoices.clients.edit(clientSlug))
                }
              />
            )}

            {isArchived ? (
              <Button
                variant="outline"
                title="Unarchive Client"
                onClick={handleUnarchive}
                isLoading={updateClient.isPending}
              />
            ) : (
              <Button
                variant="outline"
                title="Archive Client"
                onClick={handleArchive}
                isLoading={updateClient.isPending}
              />
            )}

            <Button
              variant="destructive"
              title="Delete Client"
              onClick={() => setShowDeleteConfirm(true)}
            />
          </div>
        </div>
      </Container>

      <ConfirmDialog
        visible={showDeleteConfirm}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        isConfirming={deleteClient.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <InfoDialog
        visible={limitErrorMessage !== null}
        title="Cannot Unarchive"
        message={limitErrorMessage ?? ""}
        onDismiss={() => setLimitErrorMessage(null)}
      />
    </div>
  );
}

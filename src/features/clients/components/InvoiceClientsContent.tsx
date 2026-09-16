import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";

import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { SearchInput } from "../../../components/ui/SearchInput";
import { PillTabs } from "../../../components/ui/PillTabs";
import { Spinner } from "../../../components/ui/Spinner";
import { Avatar } from "../../../components/ui/Avatar";
import { InfoDialog } from "../../../components/ui/InfoDialog";
import { CreditBadge } from "../../../components/ui/CreditBadge";
import { CreditPointsDialog } from "../../../components/ui/CreditPointsDialog";
import { InvoiceSubTabs } from "../../invoices/components/InvoiceSubTabs";
import { useClients } from "../hooks/useClients";
import { useClientUsage } from "../hooks/useClientUsage";
import { useUserProfile } from "../../profile/hooks/useUserProfile";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { ROUTES } from "../../../lib/routes";

import type { GetClientsParams } from "../api/clientsApi";
import type { Client } from "../types/clientTypes";

const ORDERING_OPTIONS: {
  key: NonNullable<GetClientsParams["ordering"]>;
  label: string;
}[] = [
  { key: "-created_at", label: "Newest" },
  { key: "name", label: "Name A-Z" },
];

function SkeletonRow() {
  return (
    <div className="flex flex-row items-center gap-3 border-b border-border py-3">
      <div className="h-10 w-10 rounded-full bg-muted" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-3 w-24 rounded bg-muted" />
      </div>
    </div>
  );
}

function ClientRow({ client }: { client: Client }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(ROUTES.invoices.clients.detail(client.slug))}
      className="flex flex-row items-center gap-3 bg-card border border-border rounded-lg p-4 text-left cursor-pointer transition-all duration-200 hover:bg-secondary/50 hover:border-border hover:shadow-md hover:-translate-y-0.5"
    >
      <Avatar name={client.name} size={40} />

      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <Text variant="body-lg" className="font-semibold truncate">
          {client.name}
        </Text>
        <Text variant="body-sm" className="text-muted-foreground truncate">
          {client.phone || client.email || "No contact info"}
        </Text>
      </div>
    </button>
  );
}

export function InvoiceClientsContent() {
  const navigate = useNavigate();
  const userProfile = useUserProfile();
  const [searchText, setSearchText] = useState("");
  const [ordering, setOrdering] =
    useState<GetClientsParams["ordering"]>("-created_at");
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  // Sentinel for scroll-triggered infinite loading — see
  // InvoiceListContent.tsx for why this replaces FlatList's
  // onEndReached on the web (IntersectionObserver instead).
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const clients = useClients({
    search: debouncedSearchText || undefined,
    ordering,
  });
  const clientUsage = useClientUsage();

  // Refetch on mount only, matching InvoiceListContent's pattern (see
  // that file for why: no focus-lifecycle event in React Router).
  useEffect(() => {
    clients.refetch();
    clientUsage.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = clients;

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allClients: Client[] =
    clients.data?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = clients.data?.pages[0]?.count ?? 0;

  const isUsageLimitReached =
    clientUsage.data?.max_allowed_client != null &&
    clientUsage.data.current_client_count >=
      clientUsage.data.max_allowed_client;

  function handleAddClientPress() {
    if (isUsageLimitReached) {
      setShowLimitDialog(true);
      return;
    }
    navigate(ROUTES.invoices.clients.create);
  }

  const searchActive = debouncedSearchText.length > 0;

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader containerVariant="desktop">
        <div className="flex flex-row items-center justify-between">
          <Text variant="heading">Clients</Text>

          <CreditBadge
            points={userProfile.data?.credit_points ?? 0}
            onClick={() => setIsCreditModalOpen(true)}
          />
        </div>
      </ScreenHeader>

      {/* Fixed block: sub-tabs, search, sort tabs, archived link — see
          InvoiceListContent.tsx for why this sits outside Container's
          scroll area. */}
      <div className="w-full mx-auto max-w-desktop px-6 pt-6 pb-4 flex flex-col gap-4">
        <InvoiceSubTabs />

        <SearchInput
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onClear={() => setSearchText("")}
          placeholder="Search by name, email or phone"
        />

        <div className="flex flex-row items-center justify-between gap-2">
          <PillTabs
            items={ORDERING_OPTIONS}
            activeKey={ordering ?? ORDERING_OPTIONS[0].key}
            onSelect={(key) => setOrdering(key as GetClientsParams["ordering"])}
            layout="segmented"
          />

          {/* Sized to match PillTabs' segmented track exactly — see
              InvoiceListContent.tsx for the h-9/rounded-md math. */}
          <Button
            variant="brand"
            shape="md"
            className="h-9 min-w-0 shrink-0 px-3.5 rounded-md"
            title="New Client"
            leftIcon={<Plus size={14} />}
            onClick={handleAddClientPress}
          />
        </div>

        <div className="flex flex-row items-center justify-between">
          {!clients.isLoading && allClients.length > 0 ? (
            <Text variant="caption" className="pl-1">
              {totalCount} {totalCount === 1 ? "client" : "clients"}
            </Text>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={() => navigate(ROUTES.invoices.clients.archived)}
            className="cursor-pointer"
          >
            <Text variant="body-sm" className="text-link">
              Archived
            </Text>
          </button>
        </div>
      </div>

      <Container variant="desktop" scroll>
        <div className="flex flex-1 flex-col gap-3 px-6 py-6">
          {clients.isLoading ? (
            <div>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : allClients.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-1">
              <Text variant="body-lg" className="font-semibold">
                {searchActive ? "No matching clients" : "No clients yet"}
              </Text>
              <Text
                variant="body-sm"
                className="text-muted-foreground text-center max-w-[280px]"
              >
                {searchActive
                  ? "Try a different search term."
                  : "Add your first client to get started."}
              </Text>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {allClients.map((client) => (
                <ClientRow key={client.slug} client={client} />
              ))}

              {clients.hasNextPage && (
                <div
                  ref={loadMoreRef}
                  className="flex items-center justify-center py-4"
                >
                  {clients.isFetchingNextPage ? <Spinner size="sm" /> : null}
                </div>
              )}
            </div>
          )}
        </div>
      </Container>

      <InfoDialog
        visible={showLimitDialog}
        title="Client Limit Reached"
        message={`You cannot add more than ${clientUsage.data?.max_allowed_client} clients in your current plan.`}
        onDismiss={() => setShowLimitDialog(false)}
      />

      <CreditPointsDialog
        visible={isCreditModalOpen}
        points={userProfile.data?.credit_points ?? 0}
        onDismiss={() => setIsCreditModalOpen(false)}
      />
    </div>
  );
}

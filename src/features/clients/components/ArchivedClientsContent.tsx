import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { SearchInput } from "../../../components/ui/SearchInput";
import { PillTabs } from "../../../components/ui/PillTabs";
import { Spinner } from "../../../components/ui/Spinner";
import { Avatar } from "../../../components/ui/Avatar";
import { InfoDialog } from "../../../components/ui/InfoDialog";
import { InvoiceSubTabs } from "../../invoices/components/InvoiceSubTabs";
import { useClients } from "../hooks/useClients";
import { useUpdateClient } from "../hooks/useUpdateClient";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { getFieldErrorMessage } from "../../../lib/api/errors";
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
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-3 w-24 rounded bg-muted" />
      </div>
    </div>
  );
}

export function ArchivedClientsContent() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [ordering, setOrdering] =
    useState<GetClientsParams["ordering"]>("-created_at");
  const [limitErrorMessage, setLimitErrorMessage] = useState<string | null>(
    null,
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const archivedClients = useClients({
    search: debouncedSearchText || undefined,
    ordering,
    is_archived: true,
  });

  const updateClient = useUpdateClient();

  useEffect(() => {
    archivedClients.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = archivedClients;

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

  const allArchivedClients: Client[] =
    archivedClients.data?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = archivedClients.data?.pages[0]?.count ?? 0;

  function handleUnarchive(slug: string) {
    updateClient.mutate(
      { slug, payload: { is_archived: false } },
      {
        onSuccess: () => {
          archivedClients.refetch();
        },
        onError: (error) => {
          setLimitErrorMessage(getFieldErrorMessage(error));
        },
      },
    );
  }

  const searchActive = debouncedSearchText.length > 0;

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader title="Archived Clients" showBackButton />

      <div className="w-full mx-auto max-w-desktop px-6 pt-6 pb-4 flex flex-col gap-4">
        <InvoiceSubTabs />

        <SearchInput
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onClear={() => setSearchText("")}
          placeholder="Search by name, email or phone"
        />

        <PillTabs
          items={ORDERING_OPTIONS}
          activeKey={ordering ?? ORDERING_OPTIONS[0].key}
          onSelect={(key) => setOrdering(key as GetClientsParams["ordering"])}
          layout="segmented"
        />

        {!archivedClients.isLoading && allArchivedClients.length > 0 && (
          <Text variant="caption">
            {totalCount} archived {totalCount === 1 ? "client" : "clients"}
          </Text>
        )}
      </div>

      <Container variant="desktop" scroll>
        <div className="flex flex-1 flex-col gap-3 px-6 py-6">
          {archivedClients.isLoading ? (
            <div>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : allArchivedClients.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-1">
              <Text variant="body-lg" className="font-semibold">
                {searchActive ? "No matching clients" : "No archived clients"}
              </Text>
              <Text
                variant="body-sm"
                className="text-muted-foreground text-center max-w-[280px]"
              >
                {searchActive
                  ? "Try a different search term."
                  : "Clients you archive will show up here."}
              </Text>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {allArchivedClients.map((client) => {
                const isUnarchiving =
                  updateClient.isPending &&
                  updateClient.variables?.slug === client.slug;

                return (
                  <div
                    key={client.slug}
                    className="flex flex-row items-center gap-3 bg-card border border-border rounded-lg p-4 transition-colors duration-200 hover:bg-card/80 hover:border-border/60"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigate(ROUTES.invoices.clients.detail(client.slug))
                      }
                      className="flex flex-1 flex-row items-center gap-3 min-w-0 text-left cursor-pointer"
                    >
                      <Avatar name={client.name} size={40} />
                      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                        <Text
                          variant="body-lg"
                          className="font-semibold truncate"
                        >
                          {client.name}
                        </Text>
                        <Text
                          variant="body-sm"
                          className="text-muted-foreground truncate"
                        >
                          {client.phone || client.email || "No contact info"}
                        </Text>
                      </div>
                    </button>

                    <Button
                      variant="primary"
                      size="sm"
                      title="Unarchive"
                      onClick={() => handleUnarchive(client.slug)}
                      isLoading={isUnarchiving}
                    />
                  </div>
                );
              })}

              {archivedClients.hasNextPage && (
                <div
                  ref={loadMoreRef}
                  className="flex items-center justify-center py-4"
                >
                  {archivedClients.isFetchingNextPage ? (
                    <Spinner size="sm" />
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>
      </Container>

      <InfoDialog
        visible={limitErrorMessage !== null}
        title="Cannot Unarchive"
        message={limitErrorMessage ?? ""}
        onDismiss={() => setLimitErrorMessage(null)}
      />
    </div>
  );
}

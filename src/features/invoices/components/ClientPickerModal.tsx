import { useState } from "react";

import { Text } from "../../../components/ui/Text";
import { Input } from "../../../components/ui/Input";
import { Spinner } from "../../../components/ui/Spinner";
import { Modal } from "../../../components/ui/Modal";
import { Avatar } from "../../../components/ui/Avatar";
import { useClients } from "../../../features/clients/hooks/useClients";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

import type { Client } from "../../../features/clients/types/clientTypes";

type ClientPickerModalProps = {
  visible: boolean;
  onSelect: (client: Client) => void;
  onDismiss: () => void;
};

// Only the first page of results is shown — a deliberate simplicity
// choice for a modal picker (search narrows results down well enough
// in practice); no infinite scroll inside the picker itself, matching
// the Expo version.
export function ClientPickerModal({
  visible,
  onSelect,
  onDismiss,
}: ClientPickerModalProps) {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const clients = useClients({
    search: debouncedSearchText || undefined,
    ordering: "name",
  });

  const clientResults = clients.data?.pages[0]?.results ?? [];

  function handleSelect(client: Client) {
    onSelect(client);
    setSearchText("");
    onDismiss();
  }

  return (
    <Modal
      visible={visible}
      dismissible
      onDismiss={onDismiss}
      title="Select Client"
    >
      <div className="flex flex-col gap-3">
        <Input
          placeholder="Search by name, email or phone"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {clients.isLoading && (
          <div className="flex items-center justify-center py-6">
            <Spinner />
          </div>
        )}

        {!clients.isLoading && clientResults.length === 0 && (
          <Text variant="body-sm" className="text-center py-3">
            No clients found.
          </Text>
        )}

        {clientResults.length > 0 && (
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto py-1">
            {clientResults.map((client) => (
              <button
                type="button"
                key={client.slug}
                onClick={() => handleSelect(client)}
                className="flex flex-row items-center gap-3 bg-card border border-border rounded-lg p-3 text-left cursor-pointer hover:bg-secondary/50"
              >
                <Avatar name={client.name} size={36} />

                <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                  <Text variant="body-sm" className="font-semibold truncate">
                    {client.name}
                  </Text>
                  <Text
                    variant="caption"
                    className="text-muted-foreground truncate"
                  >
                    {client.phone}
                  </Text>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

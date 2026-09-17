import { useState } from "react";

import { Text } from "../../../components/ui/Text";
import { Input } from "../../../components/ui/Input";
import { Spinner } from "../../../components/ui/Spinner";
import { Modal } from "../../../components/ui/Modal";
import { useProducts } from "../../../features/products/hooks/useProducts";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

import type { Product } from "../../../features/products/types/productTypes";

type ProductPickerModalProps = {
  visible: boolean;
  onSelect: (product: Product) => void;
  onDismiss: () => void;
};

// Only the first page of results is shown — a deliberate simplicity
// choice for a modal picker (search narrows results down well enough
// in practice); no infinite scroll inside the picker itself, matching
// the Expo version.
export function ProductPickerModal({
  visible,
  onSelect,
  onDismiss,
}: ProductPickerModalProps) {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const products = useProducts({
    search: debouncedSearchText || undefined,
    ordering: "title",
  });

  const productResults = products.data?.pages[0]?.results ?? [];

  function handleSelect(product: Product) {
    onSelect(product);
    setSearchText("");
    onDismiss();
  }

  return (
    <Modal
      visible={visible}
      dismissible
      onDismiss={onDismiss}
      title="Select Product"
    >
      <div className="flex flex-col gap-3">
        <Input
          placeholder="Search by title"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {products.isLoading && (
          <div className="flex items-center justify-center py-6">
            <Spinner />
          </div>
        )}

        {!products.isLoading && productResults.length === 0 && (
          <Text variant="body-sm" className="text-center py-3">
            No products found.
          </Text>
        )}

        {productResults.length > 0 && (
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto py-1">
            {productResults.map((product) => (
              <button
                type="button"
                key={product.slug}
                onClick={() => handleSelect(product)}
                className="flex flex-col gap-0.5 bg-card border border-border rounded-lg p-3 text-left cursor-pointer transition-colors duration-200 hover:bg-card/80 hover:border-border/60"
              >
                <Text variant="body-sm" className="font-semibold truncate">
                  {product.title}
                </Text>
                <Text
                  variant="caption"
                  className="text-muted-foreground truncate"
                >
                  {product.unit_price}
                </Text>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

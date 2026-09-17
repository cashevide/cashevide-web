import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Text } from "../../../components/ui/Text";
import { Input } from "../../../components/ui/Input";
import { PillTabs } from "../../../components/ui/PillTabs";
import { ProductPickerModal } from "./ProductPickerModal";

import type { Product } from "../../products/types/productTypes";
import type { InvoiceItemRequest } from "../types/invoiceItemTypes";

const UNIT_TYPE_OPTIONS: {
  label: string;
  value: NonNullable<InvoiceItemRequest["unit_type"]>;
}[] = [
  { label: "Qty", value: "QTY" },
  { label: "Hrs", value: "HRS" },
  { label: "Days", value: "DAYS" },
];

type InvoiceItemFormRowProps = {
  item: InvoiceItemRequest;
  onChange: (item: InvoiceItemRequest) => void;
  onRemove: () => void;
  // Hides the remove button when this is the only item left — an
  // invoice needs at least one item, so removing the last row would
  // leave the form in an unsubmittable state with no way back in.
  canRemove: boolean;
};

export function InvoiceItemFormRow({
  item,
  onChange,
  onRemove,
  canRemove,
}: InvoiceItemFormRowProps) {
  const [productPickerVisible, setProductPickerVisible] = useState(false);

  function handleProductSelect(product: Product) {
    onChange({
      ...item,
      product: product.id,
      title: item.title || product.title,
      description: item.description || product.description,
      unit_price: item.unit_price || product.unit_price,
    });
  }

  function handleClearProduct() {
    onChange({ ...item, product: null });
  }

  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.unit_price) || 0;
  const lineTotal = quantity * unitPrice;
  const hasLineTotal = quantity > 0 && unitPrice > 0;

  return (
    <div className="flex flex-col gap-3 border-b border-border pb-5">
      <div className="flex flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setProductPickerVisible(true)}
          className="cursor-pointer"
        >
          <Text variant="body-sm" className="text-link pl-1">
            {item.product ? "Product selected — change" : "Select from catalog"}
          </Text>
        </button>

        <div className="flex flex-row items-center gap-3">
          {item.product != null && (
            <button
              type="button"
              onClick={handleClearProduct}
              className="cursor-pointer"
            >
              <Text variant="body-sm" className="text-muted-foreground">
                Clear
              </Text>
            </button>
          )}

          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label="Remove item"
              className="cursor-pointer p-2 -m-2"
            >
              <Trash2 size={18} className="text-destructive-text" />
            </button>
          )}
        </div>
      </div>

      <Input
        placeholder="Item title"
        value={item.title ?? ""}
        onChange={(e) => onChange({ ...item, title: e.target.value })}
      />

      <Input
        placeholder="Description (optional)"
        value={item.description ?? ""}
        onChange={(e) => onChange({ ...item, description: e.target.value })}
      />

      <div className="flex flex-row items-center gap-3">
        <PillTabs
          items={UNIT_TYPE_OPTIONS.map((option) => ({
            key: option.value,
            label: option.label,
          }))}
          activeKey={item.unit_type ?? null}
          onSelect={(key) =>
            onChange({
              ...item,
              unit_type: key as InvoiceItemRequest["unit_type"],
            })
          }
          layout="segmented"
          // Matches Input's h-12 (48px): track padding (p-2.5, 10px
          // each side) + the h-7 segment (28px) = 48px, so this row
          // doesn't have a visibly shorter control next to the
          // quantity input.
          className="p-2.5"
        />

        <div className="w-20">
          <Input
            placeholder="Qty"
            inputMode="decimal"
            value={item.quantity ?? ""}
            onChange={(e) => onChange({ ...item, quantity: e.target.value })}
          />
        </div>
      </div>

      <Input
        placeholder="Unit price"
        inputMode="decimal"
        value={item.unit_price ?? ""}
        onChange={(e) => onChange({ ...item, unit_price: e.target.value })}
      />

      {/* Line total — qty × unit price, computed here so the person
          doesn't have to do that math themselves while entering an
          item, especially on mobile where there's no live preview
          to cross-check against. */}
      {hasLineTotal && (
        <div className="flex flex-row justify-end">
          <Text variant="body-sm" className="text-muted-foreground">
            Line total:{" "}
            <Text
              as="span"
              variant="body-sm"
              className="font-semibold text-foreground"
            >
              {lineTotal.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </Text>
        </div>
      )}

      <ProductPickerModal
        visible={productPickerVisible}
        onSelect={handleProductSelect}
        onDismiss={() => setProductPickerVisible(false)}
      />
    </div>
  );
}

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

// Looks up the human label ("Qty"/"Hrs"/"Days") for a unit_type value,
// for the collapsed summary line — falls back to the raw value so an
// unrecognized/legacy unit_type still shows something instead of
// silently disappearing.
function unitTypeLabel(unitType: InvoiceItemRequest["unit_type"]): string {
  return (
    UNIT_TYPE_OPTIONS.find((option) => option.value === unitType)?.label ??
    unitType ??
    ""
  );
}

export function InvoiceItemFormRow({
  item,
  onChange,
  onRemove,
  canRemove,
}: InvoiceItemFormRowProps) {
  const [productPickerVisible, setProductPickerVisible] = useState(false);
  // Two separate reasons the row can be showing its collapsed summary:
  // a product was picked from the catalog (that's a discrete "I'm
  // done" event by itself), or the person typed a manual item and
  // explicitly hit Done below. `isManuallyDone` only matters when
  // there's no product — clearing it via "Edit details" always
  // re-expands the fields regardless of which path collapsed them.
  const [isManuallyDone, setIsManuallyDone] = useState(false);
  const [isEditingItemDetails, setIsEditingItemDetails] = useState(false);

  function handleProductSelect(product: Product) {
    onChange({
      ...item,
      product: product.id,
      title: item.title || product.title,
      description: item.description || product.description,
      unit_price: item.unit_price || product.unit_price,
    });
    setIsEditingItemDetails(false);
  }

  function handleClearProduct() {
    // Resets the whole item back to its blank state (same defaults as
    // a freshly-added row), not just the catalog link — matches how
    // Clear behaves on the Client card, and avoids leaving stale
    // title/price text behind that the person would otherwise have to
    // clear by hand.
    onChange({
      ...item,
      product: null,
      title: "",
      description: "",
      quantity: "1",
      unit_type: "QTY",
      unit_price: "",
    });
  }

  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.unit_price) || 0;
  const lineTotal = quantity * unitPrice;
  const hasLineTotal = quantity > 0 && unitPrice > 0;
  const isProductSelected = item.product != null;
  // A manual item needs at least a title and a price before "Done"
  // makes sense to offer — same minimum the create/edit screens
  // already require before letting the invoice be submitted.
  const hasManualMinimum =
    !isProductSelected &&
    (item.title ?? "").trim().length > 0 &&
    (item.unit_price ?? "").trim().length > 0;
  const isCollapsed = isProductSelected || (hasManualMinimum && isManuallyDone);

  return (
    <div className="flex flex-col gap-3 border-b border-border pb-5">
      <div className="flex flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setProductPickerVisible(true)}
          className="cursor-pointer"
        >
          {item.product ? (
            <Text variant="body-sm" className="text-muted-foreground pl-1">
              Product selected{" "}
              <Text as="span" variant="body-sm" className="text-link">
                - change
              </Text>
            </Text>
          ) : (
            <Text variant="body-sm" className="text-link pl-1">
              Select from catalog
            </Text>
          )}
        </button>

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

      {isCollapsed && !isEditingItemDetails && (
        <div className="flex flex-row items-center justify-between gap-3 rounded-lg border border-border bg-secondary/30 p-4">
          <div className="flex-1 flex flex-col gap-0.5 min-w-0">
            <Text variant="body" className="font-semibold truncate">
              {item.title || "Untitled item"}
            </Text>
            {hasLineTotal && (
              <Text
                variant="body-sm"
                className="text-muted-foreground truncate"
              >
                {unitPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                × {quantity} {unitTypeLabel(item.unit_type)}
              </Text>
            )}
          </div>
          {/* Only clears the catalog link for a product-backed item —
              title/description/price the person already entered stay
              put, so this turns a catalog item into a manual one
              rather than wiping the row. A manual item that reached
              this summary via "Done" has no such link to clear, so
              it doesn't show this button at all. */}
          {isProductSelected && (
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
        </div>
      )}

      {isCollapsed && !isEditingItemDetails && (
        <button
          type="button"
          onClick={() => setIsEditingItemDetails(true)}
          className="cursor-pointer self-start"
        >
          <Text variant="body-sm" className="text-link pl-1">
            Edit details
          </Text>
        </button>
      )}

      {/* Fields show whenever the row isn't in its collapsed summary
          state — that's either a product-less item still being typed
          in (nothing to summarize yet), or "Edit details" was tapped
          on an already-collapsed row. */}
      {(!isCollapsed || isEditingItemDetails) && (
        <>
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
                onChange={(e) =>
                  onChange({ ...item, quantity: e.target.value })
                }
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

          {/* Explicit collapse to re-enter the summary state. For a
              manually-entered item (no product link), this only
              appears once title+price are filled — typing alone
              doesn't auto-collapse, so this needs a deliberate
              action. For a product-backed item reopened via "Edit
              details", it's always available since there's already a
              full record to fall back to. */}
          {(hasManualMinimum || isProductSelected) && (
            <div className="flex flex-row justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!isProductSelected) {
                    setIsManuallyDone(true);
                  }
                  setIsEditingItemDetails(false);
                }}
                className="cursor-pointer"
              >
                <Text variant="body-sm" className="text-link pl-1">
                  Done
                </Text>
              </button>
            </div>
          )}
        </>
      )}

      <ProductPickerModal
        visible={productPickerVisible}
        onSelect={handleProductSelect}
        onDismiss={() => setProductPickerVisible(false)}
      />
    </div>
  );
}

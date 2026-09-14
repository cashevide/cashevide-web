import { useEffect, useState } from "react";

import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { DateField } from "../../../components/ui/DateField";
import { Modal } from "../../../components/ui/Modal";
import { PillTabs, type PillTabItem } from "../../../components/ui/PillTabs";
import { getInputFieldClasses } from "../../../components/ui/inputFieldStyles";

import type { GetInvoicesParams } from "../api/invoicesApi";
import type { InvoiceStatus } from "../types/invoiceTypes";

// PillTabs items need a string key — "All" is represented as an empty
// string here (mapped back to `undefined` on select) since the filter
// value itself is `InvoiceStatus | undefined`.
const ALL_STATUS_KEY = "";

const STATUS_OPTIONS: (PillTabItem & { value: InvoiceStatus | undefined })[] = [
  { key: ALL_STATUS_KEY, label: "All", value: undefined },
  { key: "DRAFT", label: "Draft", value: "DRAFT" },
  { key: "UNPAID", label: "Unpaid", value: "UNPAID" },
  {
    key: "PARTIALLY_PAID",
    label: "Partially Paid",
    value: "PARTIALLY_PAID",
  },
  { key: "PAID", label: "Paid", value: "PAID" },
];

type InvoiceFilterKeys =
  | "status"
  | "currency"
  | "from_issue_date"
  | "to_issue_date"
  | "from_due_date"
  | "to_due_date";

export type InvoiceFilters = Pick<GetInvoicesParams, InvoiceFilterKeys>;

const EMPTY_FILTERS: InvoiceFilters = {
  status: undefined,
  currency: undefined,
  from_issue_date: undefined,
  to_issue_date: undefined,
  from_due_date: undefined,
  to_due_date: undefined,
};

type InvoiceFilterModalProps = {
  visible: boolean;
  initialFilters: InvoiceFilters;
  onApply: (filters: InvoiceFilters) => void;
  onDismiss: () => void;
};

export function InvoiceFilterModal({
  visible,
  initialFilters,
  onApply,
  onDismiss,
}: InvoiceFilterModalProps) {
  const [filters, setFilters] = useState<InvoiceFilters>(initialFilters);

  useEffect(() => {
    if (visible) {
      setFilters(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function handleApply() {
    onApply(filters);
    onDismiss();
  }

  function handleClear() {
    setFilters(EMPTY_FILTERS);
  }

  function handleSelectStatus(key: string) {
    const option = STATUS_OPTIONS.find((o) => o.key === key);
    setFilters((prev) => ({ ...prev, status: option?.value }));
  }

  const activeStatusKey =
    STATUS_OPTIONS.find((o) => o.value === filters.status)?.key ??
    ALL_STATUS_KEY;

  return (
    <Modal
      visible={visible}
      dismissible
      onDismiss={onDismiss}
      title="Filter Invoices"
      footer={
        <div className="flex flex-row justify-between gap-3">
          <Button variant="ghost" title="Clear" onClick={handleClear} />
          <Button variant="primary" title="Apply" onClick={handleApply} />
        </div>
      }
    >
      {/* No separate scroll wrapper needed — Modal's own content area
          (the div wrapping `children`) already scrolls via
          `overflow-y-auto`. Expo needed its own <ScrollView> because
          RN Modal doesn't provide that. */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Text variant="body-sm" className="font-semibold">
            Status
          </Text>
          <PillTabs
            items={STATUS_OPTIONS}
            activeKey={activeStatusKey}
            onSelect={handleSelectStatus}
            layout="segmented"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Text variant="body-sm" className="font-semibold">
            Currency
          </Text>
          <input
            placeholder="e.g. INR, USD"
            maxLength={3}
            value={filters.currency ?? ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                currency: e.target.value
                  ? e.target.value.toUpperCase()
                  : undefined,
              }))
            }
            className={getInputFieldClasses({
              state: "default",
              className: "w-full",
            })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Text variant="body-sm" className="font-semibold">
            Issue Date
          </Text>
          <div className="flex flex-row gap-3">
            <DateField
              label="From"
              value={filters.from_issue_date}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, from_issue_date: value }))
              }
            />
            <DateField
              label="To"
              value={filters.to_issue_date}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, to_issue_date: value }))
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Text variant="body-sm" className="font-semibold">
            Due Date
          </Text>
          <div className="flex flex-row gap-3">
            <DateField
              label="From"
              value={filters.from_due_date}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, from_due_date: value }))
              }
            />
            <DateField
              label="To"
              value={filters.to_due_date}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, to_due_date: value }))
              }
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

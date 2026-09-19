import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Text } from "../../../components/ui/Text";
import { Input } from "../../../components/ui/Input";
import { DateField } from "../../../components/ui/DateField";

import type { PaymentRecordRequest } from "../types/paymentTypes";

type InvoicePaymentFormRowProps = {
  payment: PaymentRecordRequest;
  onChange: (payment: PaymentRecordRequest) => void;
  onRemove: () => void;
};

// Same "date + amount already known, don't clutter the form" formatting
// used elsewhere for the collapsed summary line.
function formatPaymentDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function InvoicePaymentFormRow({
  payment,
  onChange,
  onRemove,
}: InvoicePaymentFormRowProps) {
  // Explicit collapse, not derived from `payment.amount` — deriving it
  // from the amount value meant the summary card popped in mid-keystroke
  // (the instant the field went non-empty), making it impossible to
  // actually type a number. Instead this only flips true when the person
  // taps "Done", and a freshly-added row always starts expanded.
  const [isCollapsed, setIsCollapsed] = useState(false);

  const hasAmount = payment.amount.trim().length > 0;
  const isExpanded = !isCollapsed || !hasAmount;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-row items-center justify-between">
        <Text
          variant="body-sm"
          className="font-semibold text-muted-foreground pl-1"
        >
          {payment.id ? `Payment #${payment.id}` : "New Payment"}
        </Text>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove payment"
          className="cursor-pointer p-2 -m-2"
        >
          <Trash2 size={18} className="text-destructive-text" />
        </button>
      </div>

      {!isExpanded && (
        <>
          {/* Not a Clear button (unlike the Client/Item summary
              cards) — there's no underlying "selection" to undo here,
              amount is just a typed value, so the whole card is a
              plain toggle back into edit mode. */}
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="cursor-pointer text-left"
          >
            <div className="flex flex-row items-center justify-between gap-3 rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                <Text variant="body" className="font-semibold truncate">
                  {payment.amount}
                </Text>
                {payment.payment_date && (
                  <Text
                    variant="body-sm"
                    className="text-muted-foreground truncate"
                  >
                    {formatPaymentDate(payment.payment_date)}
                  </Text>
                )}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="cursor-pointer self-start"
          >
            <Text variant="body-sm" className="text-link pl-1">
              Edit details
            </Text>
          </button>
        </>
      )}

      {isExpanded && (
        <>
          <Input
            placeholder="Amount"
            inputMode="decimal"
            value={payment.amount}
            onChange={(e) => onChange({ ...payment, amount: e.target.value })}
          />

          <DateField
            label="Payment Date"
            value={payment.payment_date || undefined}
            onChange={(value) =>
              onChange({ ...payment, payment_date: value ?? "" })
            }
            placeholder="Select date"
          />

          <Input
            placeholder="Payment method (optional)"
            value={payment.payment_method ?? ""}
            onChange={(e) =>
              onChange({ ...payment, payment_method: e.target.value })
            }
          />

          <Input
            placeholder="Note (optional)"
            value={payment.note ?? ""}
            onChange={(e) => onChange({ ...payment, note: e.target.value })}
          />

          {/* Explicit action to collapse — only enabled once there's
              something worth summarizing (see `hasAmount`), so a bare
              click can't collapse an empty/unsubmittable row into a
              blank-looking card. */}
          {hasAmount && (
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="cursor-pointer self-end"
            >
              <Text variant="body-sm" className="text-link pl-1">
                Done
              </Text>
            </button>
          )}
        </>
      )}
    </div>
  );
}

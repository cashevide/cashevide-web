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

export function InvoicePaymentFormRow({
  payment,
  onChange,
  onRemove,
}: InvoicePaymentFormRowProps) {
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
    </div>
  );
}

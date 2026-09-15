import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import { useInvoiceDetails } from "../hooks/useInvoiceDetails";
import { useUpdateInvoice } from "../hooks/useUpdateInvoice";
import { ROUTES } from "../../../lib/routes";
import { cn } from "../../../utils/cn";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
import { PillTabs } from "../../../components/ui/PillTabs";
import { CurrencyPicker } from "../../../components/ui/CurrencyPicker";
import { DateField } from "../../../components/ui/DateField";
import { Divider } from "../../../components/ui/Divider";
import { Modal } from "../../../components/ui/Modal";
import { ClientPickerModal } from "../components/ClientPickerModal";
import { InvoiceItemFormRow } from "../components/InvoiceItemFormRow";
import { InvoicePaymentFormRow } from "../components/InvoicePaymentFormRow";
import { InvoicePreview } from "../components/InvoicePreview";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

import type { Client } from "../../clients/types/clientTypes";
import type { InvoiceItemRequest } from "../types/invoiceItemTypes";
import type { PaymentRecordRequest } from "../types/paymentTypes";
import type {
  CreateInvoiceError,
  InvoiceTemplate,
  UpdateInvoiceRequest,
} from "../types/invoiceTypes";
import type { InvoicePreviewData } from "../components/InvoicePreview";

type Section = "details" | "payments";

const SECTION_TABS = [
  { key: "details", label: "Details & Items" },
  { key: "payments", label: "Payments" },
];

// Display-only label for the locked template — backend rejects any PUT
// that changes this value ("Template cannot be changed once the invoice
// is created."), so this screen never lets it be edited.
const TEMPLATE_LABEL: Record<InvoiceTemplate, string> = {
  classic: "Classic",
  standard: "Standard",
};

function extractErrorMessage(error: CreateInvoiceError): string {
  if (Array.isArray(error)) {
    return error.join("\n");
  }

  const messages: string[] = [];

  for (const [field, value] of Object.entries(error)) {
    if (field === "items" || field === "payments") {
      continue;
    }
    if (Array.isArray(value)) {
      messages.push(`${field}: ${value.join(", ")}`);
    }
  }

  return messages.length > 0
    ? messages.join("\n")
    : "Something went wrong. Please check your entries and try again.";
}

function createEmptyItem(): InvoiceItemRequest {
  return {
    product: null,
    title: "",
    description: "",
    quantity: "1",
    unit_type: "QTY",
    unit_price: "",
  };
}

function createEmptyPayment(): PaymentRecordRequest {
  return {
    amount: "",
    payment_date: "",
    payment_method: "",
    note: "",
  };
}

// Same client-side "live running total" preview math as
// InvoiceCreateContent — the backend recomputes subtotal/total_amount
// from what it actually saves and is always the source of truth. This
// only mirrors it while the person is still editing.
function calculateItemTotal(item: InvoiceItemRequest): number {
  const quantity = parseFloat(item.quantity ?? "0");
  const unitPrice = parseFloat(item.unit_price ?? "0");
  if (Number.isNaN(quantity) || Number.isNaN(unitPrice)) {
    return 0;
  }
  return quantity * unitPrice;
}

export function InvoiceEditContent() {
  const navigate = useNavigate();
  const { id: idParam } = useParams<{ id: string }>();
  const id = Number(idParam);
  const [searchParams] = useSearchParams();
  const sectionParam = searchParams.get("section");

  // Same 768px breakpoint used across the app (see InvoiceListContent,
  // InvoiceCreateContent, InvoiceDetailsContent).
  const isDesktopLayout = useMediaQuery("(min-width: 768px)");

  const invoiceDetails = useInvoiceDetails(id, { enabled: !Number.isNaN(id) });
  const updateInvoice = useUpdateInvoice();

  const [activeSection, setActiveSection] = useState<Section>(
    sectionParam === "payments" ? "payments" : "details",
  );

  const [clientPickerVisible, setClientPickerVisible] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  // Same as InvoiceCreateContent — pre-filled client fields stay
  // editable (the saved record can be missing something this invoice
  // needs) but collapsed behind this toggle by default.
  const [isEditingClientDetails, setIsEditingClientDetails] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("");
  const [issueDate, setIssueDate] = useState<string | undefined>(undefined);
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [discount, setDiscount] = useState("0");
  // Starts expanded if the loaded invoice already has a non-zero
  // discount — collapsing it in that case would hide a value the
  // person actually set, which the initializing useEffect below flips
  // back on once the invoice data loads.
  const [isDiscountVisible, setIsDiscountVisible] = useState(false);
  const [items, setItems] = useState<InvoiceItemRequest[]>([]);
  const [payments, setPayments] = useState<PaymentRecordRequest[]>([]);
  // Locked at load time — never exposed as an editable field, only ever
  // read back and sent unchanged in the PUT payload (see handleSubmit).
  const [template, setTemplate] = useState<InvoiceTemplate>("classic");
  // Lets the person reclaim the preview column's width for the form —
  // same as InvoiceCreateContent.
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    if (invoiceDetails.data && !formInitialized) {
      const invoice = invoiceDetails.data;

      setSelectedClientId(invoice.client);
      setName(invoice.name);
      setEmail(invoice.email);
      setPhone(invoice.phone);
      setAddress(invoice.address);
      setCurrency(invoice.currency);
      setIssueDate(invoice.issue_date ?? undefined);
      setDueDate(invoice.due_date ?? undefined);
      setDiscount(invoice.discount);
      setIsDiscountVisible((parseFloat(invoice.discount) || 0) > 0);
      setTemplate(invoice.template);

      setItems(
        invoice.items.map((item) => ({
          id: item.id,
          product: item.product,
          title: item.title,
          description: item.description,
          quantity: item.quantity,
          unit_type: item.unit_type,
          unit_price: item.unit_price,
        })),
      );

      setPayments(
        invoice.payments.map((payment) => ({
          id: payment.id,
          amount: payment.amount,
          payment_date: payment.payment_date,
          payment_method: payment.payment_method,
          note: payment.note,
        })),
      );

      setFormInitialized(true);
    }
  }, [invoiceDetails.data, formInitialized]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + calculateItemTotal(item), 0),
    [items],
  );
  const discountValue = parseFloat(discount) || 0;
  const total = Math.max(subtotal - discountValue, 0);

  // Live draft preview built from current form state. amount_paid /
  // balance_due are NOT recalculated here — they stay pinned to the
  // originally loaded invoice, since accurately deriving them from
  // in-progress payment edits would require replicating backend payment-
  // allocation logic on the client. The backend is the source of truth
  // for those two fields once the form is actually saved.
  //
  // id and business_snapshot are passed straight from the loaded
  // invoice so the preview layouts treat this as a saved invoice and
  // render business details from its frozen snapshot — never from the
  // live business profile, since editing an existing invoice must not
  // make the preview show details that don't match what's already
  // baked into that invoice's PDF.
  const draftPreview: InvoicePreviewData | null = useMemo(() => {
    if (!invoiceDetails.data) {
      return null;
    }

    return {
      id: invoiceDetails.data.id,
      invoice_number: invoiceDetails.data.invoice_number,
      status: invoiceDetails.data.status,
      template,
      business_snapshot: invoiceDetails.data.business_snapshot,
      currency,
      issue_date: issueDate,
      due_date: dueDate,
      name: name || "Untitled Client",
      email,
      phone,
      address,
      items: items.map((item, index) => ({
        id: item.id ?? `draft-${index}`,
        title: item.title ?? "",
        quantity: item.quantity ?? "",
        unit_price: item.unit_price ?? "",
        total: calculateItemTotal(item).toFixed(2),
      })),
      subtotal: subtotal.toFixed(2),
      discount: discountValue.toFixed(2),
      total_amount: total.toFixed(2),
      amount_paid: invoiceDetails.data.amount_paid,
      balance_due: invoiceDetails.data.balance_due,
    };
  }, [
    invoiceDetails.data,
    template,
    currency,
    issueDate,
    dueDate,
    name,
    email,
    phone,
    address,
    items,
    subtotal,
    discountValue,
    total,
  ]);

  function handleSelectClient(client: Client) {
    setSelectedClientId(client.id);
    setName(client.name);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address);
    setIsEditingClientDetails(false);
  }

  function handleClearClient() {
    setSelectedClientId(null);
  }

  function handleAddItem() {
    setItems((prev) => [...prev, createEmptyItem()]);
  }

  function handleItemChange(index: number, updatedItem: InvoiceItemRequest) {
    setItems((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? updatedItem : item)),
    );
  }

  function handleRemoveItem(index: number) {
    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }

  function handleAddPayment() {
    setPayments((prev) => [...prev, createEmptyPayment()]);
  }

  function handlePaymentChange(
    index: number,
    updatedPayment: PaymentRecordRequest,
  ) {
    setPayments((prev) =>
      prev.map((payment, paymentIndex) =>
        paymentIndex === index ? updatedPayment : payment,
      ),
    );
  }

  function handleRemovePayment(index: number) {
    setPayments((prev) =>
      prev.filter((_, paymentIndex) => paymentIndex !== index),
    );
  }

  function handleSubmit() {
    if (selectedClientId == null && !name.trim()) {
      setErrorMessage("Select an existing client or enter a client name.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Add at least one item to the invoice.");
      return;
    }

    for (const item of items) {
      if (!item.product && (!item.title?.trim() || !item.unit_price)) {
        setErrorMessage(
          "Each item needs a product selected, or a title and unit price entered manually.",
        );
        return;
      }
    }

    for (const payment of payments) {
      if (!payment.amount || !payment.payment_date) {
        setErrorMessage("Each payment needs an amount and a payment date.");
        return;
      }
    }

    // PUT-only backend for invoices — no PATCH support. items/payments
    // must always be sent as full arrays (existing entries carry their
    // id so the backend can match and update them), or the backend
    // responds with required-field errors for anything omitted.
    const payload: UpdateInvoiceRequest = {
      client: selectedClientId,
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      currency: currency || undefined,
      issue_date: issueDate ?? null,
      due_date: dueDate ?? null,
      discount: discount || "0",
      // Always the same value loaded from the invoice — the backend
      // rejects any change to this field after creation.
      template,
      items,
      payments,
    };

    updateInvoice.mutate(
      { id, payload },
      {
        onSuccess: () => {
          navigate(ROUTES.invoices.detail(id), { replace: true });
        },
        onError: (error) => {
          const responseData = (
            error as { response?: { data?: CreateInvoiceError } }
          )?.response?.data;

          setErrorMessage(
            responseData
              ? extractErrorMessage(responseData)
              : "Something went wrong. Please try again.",
          );
        },
      },
    );
  }

  if (Number.isNaN(id)) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
        <ScreenHeader
          title="Invoice"
          showBackButton
          containerVariant="desktop"
        />
        <Container variant="desktop">
          <div className="flex flex-1 items-center justify-center">
            <Text variant="body" className="text-muted-foreground">
              Invalid invoice.
            </Text>
          </div>
        </Container>
      </div>
    );
  }

  if (invoiceDetails.isLoading || !formInitialized) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
        <ScreenHeader
          title="Edit Invoice"
          showBackButton
          containerVariant="desktop"
        />
        <Container variant="desktop">
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        </Container>
      </div>
    );
  }

  if (invoiceDetails.isError || !invoiceDetails.data) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
        <ScreenHeader
          title="Edit Invoice"
          showBackButton
          containerVariant="desktop"
        />
        <Container variant="desktop">
          <div className="flex flex-1 items-center justify-center">
            <Text variant="body" className="text-muted-foreground">
              This invoice could not be found.
            </Text>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader showBackButton containerVariant="desktop">
        <div className="flex flex-row items-center justify-between">
          <Text variant="body-lg" className="font-semibold text-2xl truncate">
            {invoiceDetails.data.name || "Untitled Client"}
            <span className="text-muted-foreground">
              {" - "}
              {invoiceDetails.data.invoice_number}
            </span>
          </Text>

          {isDesktopLayout && (
            <button
              type="button"
              onClick={() => setIsPreviewVisible((prev) => !prev)}
              className="cursor-pointer"
            >
              <Text variant="body-sm" className="text-link">
                {isPreviewVisible ? "Hide Preview" : "Show Preview"}
              </Text>
            </button>
          )}
        </div>
      </ScreenHeader>

      <Container variant="desktop" scroll>
        <div
          className={cn(
            "px-6 py-6 flex flex-col gap-8 pb-32",
            isDesktopLayout && "flex-row items-start gap-8",
          )}
        >
          {/* -------------------- Form column -------------------- */}
          <div
            className={cn("flex flex-col gap-10", isDesktopLayout && "flex-1")}
          >
            <PillTabs
              items={SECTION_TABS}
              activeKey={activeSection}
              onSelect={(key) => setActiveSection(key as Section)}
              layout="segmented"
            />

            {activeSection === "details" && (
              <>
                {/* -------------------- Template (locked) -------------------- */}
                <div className="flex flex-col gap-1">
                  <Text variant="subheading">Template</Text>
                  <div className="flex flex-row items-center justify-between rounded-lg bg-secondary/30 p-4">
                    <Text variant="body-sm">{TEMPLATE_LABEL[template]}</Text>
                    <Text variant="caption" className="text-muted-foreground">
                      Locked after creation
                    </Text>
                  </div>
                </div>

                <Divider />

                {/* -------------------- Client -------------------- */}
                <div className="flex flex-col gap-3">
                  <Text variant="subheading">Client</Text>

                  {selectedClientId != null ? (
                    <>
                      <div className="flex flex-row items-center justify-between gap-3 rounded-lg bg-secondary/30 p-4">
                        <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                          <Text
                            variant="body"
                            className="font-semibold truncate"
                          >
                            {name}
                          </Text>
                        </div>
                        <button
                          type="button"
                          onClick={handleClearClient}
                          className="cursor-pointer"
                        >
                          <Text
                            variant="body-sm"
                            className="text-muted-foreground"
                          >
                            Clear
                          </Text>
                        </button>
                      </div>

                      {/* Collapsed by default — see InvoiceCreateContent
                          for why these stay editable rather than
                          locked or hidden entirely. */}
                      <button
                        type="button"
                        onClick={() =>
                          setIsEditingClientDetails((prev) => !prev)
                        }
                        className="cursor-pointer self-start"
                      >
                        <Text variant="body-sm" className="text-link">
                          {isEditingClientDetails
                            ? "Hide details"
                            : "Edit details"}
                        </Text>
                      </button>

                      {isEditingClientDetails && (
                        <div className="flex flex-col gap-3">
                          <Input
                            placeholder="Client name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                          <Input
                            placeholder="Email (optional)"
                            type="email"
                            autoCapitalize="none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <Input
                            placeholder="Phone (optional)"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                          <Input
                            placeholder="Address (optional)"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            multiline
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={() => setClientPickerVisible(true)}
                        className="cursor-pointer self-start"
                      >
                        <Text variant="body-sm" className="text-link">
                          Select from existing clients
                        </Text>
                      </button>

                      <Input
                        placeholder="Client name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <Input
                        placeholder="Email (optional)"
                        type="email"
                        autoCapitalize="none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Input
                        placeholder="Phone (optional)"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <Input
                        placeholder="Address (optional)"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        multiline
                      />
                    </div>
                  )}
                </div>

                <Divider />

                {/* -------------------- Invoice details -------------------- */}
                <div className="flex flex-col gap-3">
                  <Text variant="subheading">Invoice Details</Text>

                  <div className="flex flex-col gap-1">
                    <Text variant="body-sm" className="text-muted-foreground">
                      Currency
                    </Text>
                    <CurrencyPicker value={currency} onChange={setCurrency} />
                  </div>

                  <div className="flex flex-row gap-3">
                    <DateField
                      label="Issue date"
                      value={issueDate}
                      onChange={setIssueDate}
                      placeholder="Not set"
                    />
                    <DateField
                      label="Due date"
                      value={dueDate}
                      onChange={setDueDate}
                      placeholder="Not set"
                    />
                  </div>
                </div>

                <Divider />

                {/* -------------------- Items -------------------- */}
                <div className="flex flex-col gap-3">
                  <Text variant="subheading">Items</Text>

                  <div className="flex flex-col gap-5">
                    {items.map((item, index) => (
                      <InvoiceItemFormRow
                        key={index}
                        item={item}
                        onChange={(updatedItem) =>
                          handleItemChange(index, updatedItem)
                        }
                        onRemove={() => handleRemoveItem(index)}
                        canRemove={items.length > 1}
                      />
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    title="+ Add Item"
                    onClick={handleAddItem}
                  />
                </div>

                <Divider />

                {/* -------------------- Discount -------------------- */}
                <div className="flex flex-col gap-3">
                  {isDiscountVisible ? (
                    <>
                      <Text variant="subheading">Discount</Text>
                      <Input
                        placeholder="Discount amount"
                        inputMode="decimal"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                      />
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsDiscountVisible(true)}
                      className="cursor-pointer self-start"
                    >
                      <Text variant="body-sm" className="text-link">
                        + Add discount
                      </Text>
                    </button>
                  )}

                  {/* Mirrors InvoiceCreateContent: on mobile there's no
                      side-by-side preview for the running total, so this
                      summary card stays as the only place to see it. */}
                  {!isDesktopLayout && (
                    <div className="flex flex-col gap-2 rounded-lg bg-secondary/30 p-4">
                      <div className="flex flex-row items-center justify-between">
                        <Text
                          variant="body-sm"
                          className="text-muted-foreground"
                        >
                          Subtotal
                        </Text>
                        <Text variant="body-sm">
                          {currency} {subtotal.toFixed(2)}
                        </Text>
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <Text
                          variant="body-sm"
                          className="text-muted-foreground"
                        >
                          Discount
                        </Text>
                        <Text variant="body-sm">
                          -{currency} {discountValue.toFixed(2)}
                        </Text>
                      </div>
                      <Divider />
                      <div className="flex flex-row items-center justify-between">
                        <Text variant="body" className="font-semibold">
                          Total
                        </Text>
                        <Text variant="body" className="font-semibold">
                          {currency} {total.toFixed(2)}
                        </Text>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeSection === "payments" && (
              <div className="flex flex-col gap-3">
                <Text variant="subheading">Payments</Text>

                <div className="flex flex-col gap-3">
                  {payments.map((payment, index) => (
                    <InvoicePaymentFormRow
                      key={index}
                      payment={payment}
                      onChange={(updatedPayment) =>
                        handlePaymentChange(index, updatedPayment)
                      }
                      onRemove={() => handleRemovePayment(index)}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  title="+ Add Payment"
                  onClick={handleAddPayment}
                />
              </div>
            )}
          </div>

          {/* -------------------- Live preview column (desktop only, toggleable) -------------------- */}
          {isDesktopLayout && isPreviewVisible && draftPreview && (
            <div className="flex-1">
              <InvoicePreview invoice={draftPreview} />
            </div>
          )}
        </div>
      </Container>

      {/* -------------------- Sticky bottom submit -------------------- */}
      <div className="w-full border-t border-border bg-background">
        <div className="w-full max-w-desktop mx-auto">
          <div className="flex flex-row items-center justify-end gap-4 px-6 py-4">
            <Button
              variant="primary"
              title="Save Changes"
              onClick={handleSubmit}
              isLoading={updateInvoice.isPending}
            />
          </div>
        </div>
      </div>

      <ClientPickerModal
        visible={clientPickerVisible}
        onSelect={handleSelectClient}
        onDismiss={() => setClientPickerVisible(false)}
      />

      <Modal
        visible={errorMessage !== null}
        dismissible
        onDismiss={() => setErrorMessage(null)}
        title="Could not update invoice"
        description={errorMessage}
        footer={
          <Button
            variant="primary"
            title="OK"
            fullWidth
            onClick={() => setErrorMessage(null)}
          />
        }
      />
    </div>
  );
}

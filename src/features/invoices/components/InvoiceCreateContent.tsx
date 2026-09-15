import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { useBusinessProfile } from "../../business-profile/hooks/useBusinessProfile";
import { useCreateInvoice } from "../hooks/useCreateInvoice";
import { ROUTES } from "../../../lib/routes";
import { cn } from "../../../utils/cn";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
import { CurrencyPicker } from "../../../components/ui/CurrencyPicker";
import { DateField } from "../../../components/ui/DateField";
import { PillTabs } from "../../../components/ui/PillTabs";
import { Divider } from "../../../components/ui/Divider";
import { Modal } from "../../../components/ui/Modal";
import { ClientPickerModal } from "../components/ClientPickerModal";
import { InvoiceItemFormRow } from "../components/InvoiceItemFormRow";
import { InvoicePreview } from "../components/InvoicePreview";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

import type { Client } from "../../clients/types/clientTypes";
import type { InvoiceItemRequest } from "../types/invoiceItemTypes";
import type {
  CreateInvoiceError,
  CreateInvoiceRequest,
  InvoiceTemplate,
} from "../types/invoiceTypes";
import type { InvoicePreviewData } from "../components/InvoicePreview";

const TEMPLATE_OPTIONS: { label: string; value: InvoiceTemplate }[] = [
  { label: "Classic", value: "classic" },
  { label: "Standard", value: "standard" },
];

function isBusinessProfileComplete(profile: {
  business_name: string;
  logo: string | null;
  address: string;
}): boolean {
  return (
    profile.business_name.trim().length > 0 &&
    profile.logo != null &&
    profile.address.trim().length > 0
  );
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

// Client-side preview only — the backend recomputes subtotal/total_amount
// from the items it actually saves and is always the source of truth.
// This just gives the person a live running total while they type,
// mirroring the "keep pricing visible while filling in details" pattern
// used by mobile checkout flows.
function calculateItemTotal(item: InvoiceItemRequest): number {
  const quantity = parseFloat(item.quantity ?? "0");
  const unitPrice = parseFloat(item.unit_price ?? "0");
  if (Number.isNaN(quantity) || Number.isNaN(unitPrice)) {
    return 0;
  }
  return quantity * unitPrice;
}

function formatAmount(amount: number, currency: string): string {
  return `${currency ? currency + " " : ""}${amount.toFixed(2)}`;
}

export function InvoiceCreateContent() {
  const navigate = useNavigate();
  const businessProfile = useBusinessProfile();
  const createInvoice = useCreateInvoice();
  // Same 768px breakpoint used across the app (see InvoiceListScreen) —
  // below it there isn't room for form + preview side by side, so the
  // preview is hidden entirely rather than squeezed into an unreadable
  // column. This drives conditional rendering (not just styling), so
  // it needs live JS state rather than a pure CSS class.
  const isDesktopLayout = useMediaQuery("(min-width: 768px)");
  // Lets the person reclaim the preview column's width for the form
  // when they don't need to see the live preview while filling in
  // details — mobile has no preview column to toggle, so this only
  // has an effect on desktop.
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  const [clientPickerVisible, setClientPickerVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  // Selecting a client pre-fills name/email/phone/address from their
  // saved record, but that record can be missing something this
  // invoice needs (e.g. no address on file) — so the fields stay
  // editable rather than locked, just collapsed behind this toggle by
  // default so the common case (record already has everything) isn't
  // cluttered with fields nobody needs to touch.
  const [isEditingClientDetails, setIsEditingClientDetails] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("");
  const [issueDate, setIssueDate] = useState<string | undefined>(undefined);
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [discount, setDiscount] = useState("0");
  // Collapsed behind a link by default — most invoices don't need a
  // discount, so an always-visible "0" field would be one more thing
  // to skip past on every single invoice.
  const [isDiscountVisible, setIsDiscountVisible] = useState(false);
  const [items, setItems] = useState<InvoiceItemRequest[]>([createEmptyItem()]);
  // Defaults to "classic" — matches the backend's own default when this
  // field is omitted, so an untouched form and a submitted-without-
  // changing-it form behave identically.
  const [template, setTemplate] = useState<InvoiceTemplate>("classic");

  const [currencyInitialized, setCurrencyInitialized] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (businessProfile.data?.currency && !currencyInitialized) {
      setCurrency(businessProfile.data.currency);
      setCurrencyInitialized(true);
    }
  }, [businessProfile.data, currencyInitialized]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + calculateItemTotal(item), 0),
    [items],
  );
  const discountValue = parseFloat(discount) || 0;
  const total = Math.max(subtotal - discountValue, 0);

  // Client-only preview state, rebuilt from live form state on every
  // render — this is never sent to the backend, purely a "what the
  // invoice will roughly look like" view while the person is still
  // filling in the form. No id/invoice_number/status yet, since the
  // invoice doesn't exist on the server until submit succeeds.
  const draftPreview: InvoicePreviewData = useMemo(
    () => ({
      template,
      currency,
      issue_date: issueDate,
      due_date: dueDate,
      name: selectedClient?.name || name || "Untitled Client",
      email: selectedClient?.email || email,
      phone: selectedClient?.phone || phone,
      address: selectedClient?.address || address,
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
    }),
    [
      template,
      currency,
      issueDate,
      dueDate,
      selectedClient,
      name,
      email,
      phone,
      address,
      items,
      subtotal,
      discountValue,
      total,
    ],
  );

  function handleSelectClient(client: Client) {
    setSelectedClient(client);
    setName(client.name);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address);
    setIsEditingClientDetails(false);
  }

  function handleClearClient() {
    setSelectedClient(null);
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

  function handleSubmit() {
    if (!selectedClient && !name.trim()) {
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

    const payload: CreateInvoiceRequest = {
      client: selectedClient?.id ?? null,
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      currency: currency || undefined,
      issue_date: issueDate ?? null,
      due_date: dueDate ?? null,
      discount: discount || "0",
      template,
      items,
      payments: [],
    };

    createInvoice.mutate(payload, {
      onSuccess: (data) => {
        navigate(ROUTES.invoices.detail(data.id), { replace: true });
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
    });
  }

  if (businessProfile.isLoading) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
        <ScreenHeader
          title="New Invoice"
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

  if (
    !businessProfile.data ||
    !isBusinessProfileComplete(businessProfile.data)
  ) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
        <ScreenHeader
          title="New Invoice"
          showBackButton
          containerVariant="desktop"
        />
        <Container variant="desktop">
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
            <Text variant="subheading" className="text-center">
              Complete Your Business Profile
            </Text>
            <Text
              variant="body-sm"
              className="text-center text-muted-foreground"
            >
              Add your business name, logo, and address before creating an
              invoice — this information appears on every invoice you send.
            </Text>
            <div className="mt-2">
              <Button
                variant="primary"
                title="Complete Business Profile"
                onClick={() => navigate(ROUTES.profile.home)}
              />
            </div>
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
            New Invoice
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
            {/* -------------------- Template -------------------- */}
            <div className="flex flex-col gap-3">
              <Text variant="subheading">Template</Text>
              <PillTabs
                items={TEMPLATE_OPTIONS.map((option) => ({
                  key: option.value,
                  label: option.label,
                }))}
                activeKey={template}
                onSelect={(key) => setTemplate(key as InvoiceTemplate)}
                layout="segmented"
              />
            </div>

            <Divider />

            {/* -------------------- Client -------------------- */}
            <div className="flex flex-col gap-3">
              <Text variant="subheading">Client</Text>

              {selectedClient ? (
                <>
                  <div className="flex flex-row items-center justify-between gap-3 rounded-lg bg-secondary/30 p-4">
                    <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                      <Text variant="body" className="font-semibold truncate">
                        {selectedClient.name}
                      </Text>
                      <Text
                        variant="body-sm"
                        className="text-muted-foreground truncate"
                      >
                        {selectedClient.phone}
                      </Text>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearClient}
                      className="cursor-pointer"
                    >
                      <Text variant="body-sm" className="text-muted-foreground">
                        Clear
                      </Text>
                    </button>
                  </div>

                  {/* Collapsed by default — the fields are pre-filled
                      from the client's saved record, but that record
                      can be missing something this invoice needs
                      (e.g. no address on file), so they stay editable
                      behind this toggle rather than locked or hidden
                      entirely. */}
                  <button
                    type="button"
                    onClick={() => setIsEditingClientDetails((prev) => !prev)}
                    className="cursor-pointer self-start"
                  >
                    <Text variant="body-sm" className="text-link">
                      {isEditingClientDetails ? "Hide details" : "Edit details"}
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
                />
                <DateField
                  label="Due date"
                  value={dueDate}
                  onChange={setDueDate}
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

              {/* On mobile there's no side-by-side preview to show the
                  running total, so this summary card stays as the only
                  place to see it. On desktop the preview column covers
                  the same numbers, so it's dropped here to avoid
                  showing the same total twice. */}
              {!isDesktopLayout && (
                <div className="flex flex-col gap-2 rounded-lg bg-secondary/30 p-4">
                  <div className="flex flex-row items-center justify-between">
                    <Text variant="body-sm" className="text-muted-foreground">
                      Subtotal
                    </Text>
                    <Text variant="body-sm">
                      {formatAmount(subtotal, currency)}
                    </Text>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <Text variant="body-sm" className="text-muted-foreground">
                      Discount
                    </Text>
                    <Text variant="body-sm">
                      -{formatAmount(discountValue, currency)}
                    </Text>
                  </div>
                  <Divider />
                  <div className="flex flex-row items-center justify-between">
                    <Text variant="body" className="font-semibold">
                      Total
                    </Text>
                    <Text variant="body" className="font-semibold">
                      {formatAmount(total, currency)}
                    </Text>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* -------------------- Live preview column (desktop only, toggleable) -------------------- */}
          {isDesktopLayout && isPreviewVisible && (
            <div className="flex-1">
              <InvoicePreview invoice={draftPreview} />
            </div>
          )}
        </div>
      </Container>

      {/* -------------------- Sticky bottom summary + submit -------------------- */}
      <div className="w-full border-t border-border bg-background">
        <div className="w-full max-w-desktop mx-auto">
          <div className="flex flex-row items-center gap-4 px-6 py-4">
            <div className="flex-1 flex flex-col gap-0.5">
              <Text variant="caption">Total</Text>
              <Text variant="body-lg" className="font-semibold">
                {formatAmount(total, currency)}
              </Text>
            </div>

            <Button
              variant="primary"
              title="Create Invoice"
              onClick={handleSubmit}
              isLoading={createInvoice.isPending}
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
        title="Could not create invoice"
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

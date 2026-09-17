import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { useBusinessProfile } from "../../business-profile/hooks/useBusinessProfile";
import { useCreateInvoice } from "../hooks/useCreateInvoice";
import { ROUTES } from "../../../lib/routes";
import { cn } from "../../../utils/cn";
import { useThemeStore } from "../../../stores/themeStore";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Switch } from "../../../components/ui/Switch";
import { Spinner } from "../../../components/ui/Spinner";
import { CurrencyPicker } from "../../../components/ui/CurrencyPicker";
import { DateField, toDateString } from "../../../components/ui/DateField";
import { PillTabs } from "../../../components/ui/PillTabs";
import { Divider } from "../../../components/ui/Divider";
import { Modal } from "../../../components/ui/Modal";
import { InfoDialog } from "../../../components/ui/InfoDialog";
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
  { label: "Customizable", value: "customizable" },
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
  const theme = useThemeStore((state) => state.theme);
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
  const [issueDate, setIssueDate] = useState<string | undefined>(() =>
    toDateString(new Date()),
  );
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
  // "Customizable" has a PDF layout on the backend but isn't feature-
  // complete on this screen yet — picking it shows this dialog instead
  // of actually switching `template`, so the form always stays on a
  // fully-supported template.
  const [showCustomizableComingSoon, setShowCustomizableComingSoon] =
    useState(false);

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
          showCreditPoints={false}
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
          showCreditPoints={false}
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
                onClick={() => navigate(ROUTES.profile.businessEdit)}
              />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader showBackButton showCreditPoints={false}>
        <div className="flex flex-row items-center justify-between">
          <Text variant="body-lg" className="font-semibold text-2xl truncate">
            New Invoice
          </Text>

          {isDesktopLayout && (
            <div className="flex flex-row items-center gap-2">
              <Text variant="body-sm" className="text-muted-foreground">
                Preview
              </Text>
              <Switch
                value={isPreviewVisible}
                onValueChange={setIsPreviewVisible}
                ariaLabel="Toggle invoice preview"
              />
            </div>
          )}
        </div>
      </ScreenHeader>

      <Container variant="desktop" scroll>
        <div
          className={cn(
            "px-6 py-6 flex flex-col gap-8 pb-32",
            isDesktopLayout && "flex-row items-start",
          )}
        >
          {/* -------------------- Form column -------------------- */}
          <div
            className={cn(
              "flex flex-col gap-6",
              // min-w-0 alongside flex-1 — without it, a flex
              // item's default min-width is its content's natural
              // width, so this column (and the row it's in) can
              // still be forced wider than the viewport by its own
              // content even after the preview column next to it
              // is made shrinkable.
              isDesktopLayout && "flex-1 min-w-0",
            )}
          >
            {/* -------------------- Template -------------------- */}
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
              <Text variant="subheading">Template</Text>
              <PillTabs
                items={TEMPLATE_OPTIONS.map((option) => ({
                  key: option.value,
                  label: option.label,
                }))}
                activeKey={template}
                onSelect={(key) => {
                  if (key === "customizable") {
                    setShowCustomizableComingSoon(true);
                    return;
                  }
                  setTemplate(key as InvoiceTemplate);
                }}
                layout="segmented"
              />
            </div>

            {/* -------------------- Client -------------------- */}
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
              <Text variant="subheading">Client</Text>

              {selectedClient ? (
                <>
                  <div className="flex flex-row items-center justify-between gap-3 rounded-lg border border-border bg-secondary/30 p-4">
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

            {/* -------------------- Invoice details -------------------- */}
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
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

            {/* -------------------- Items -------------------- */}
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
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

            {/* -------------------- Discount -------------------- */}
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
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
                <div className="flex flex-col gap-2 rounded-lg border border-border bg-secondary/30 p-4">
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
          {isDesktopLayout && (
            // Two nested layers, matching how a CSS accordion is
            // usually collapsed:
            //  - Outer (this one): the actual flex item. Animates
            //    max-width from 0 to a large unconstrained value
            //    (never the true rendered width, which is itself
            //    dynamic — see the inner div's own comment) plus
            //    opacity and its own left margin (standing in for the
            //    row's gap-8, see the row div's comment) — so hiding
            //    the preview smoothly shrinks the form column back to
            //    full width instead of just vanishing.
            //  - overflow-hidden so the inner 700px-wide content is
            //    clipped rather than reflowing/wrapping while the
            //    outer box is mid-collapse.
            //  - Kept mounted at all times (isPreviewVisible no
            //    longer gates rendering) — unmounting on toggle is
            //    exactly what made it a hard cut instead of an
            //    animation; ClassicInvoiceLayout's own ResizeObserver
            //    also depends on staying mounted to keep tracking the
            //    inner div's width as it animates.
            <div
              className={cn(
                "shrink overflow-hidden transition-[max-width,opacity,margin-left] duration-300 ease-in-out",
                isPreviewVisible
                  ? "max-w-[700px] opacity-100 ml-8"
                  : "max-w-0 opacity-0 ml-0 pointer-events-none",
              )}
            >
              {/* sticky (not a second Container/scroll) — the outer
                  Container above is still the only element with page
                  scroll, so a sticky column here rides along with it
                  but pins to the viewport once its top edge is
                  reached. Its own max-height + overflow-y-auto then
                  scrolls the preview independently, capped to the
                  visible viewport height (minus header/footer bars)
                  rather than the page's full scrollable height, so a
                  long invoice preview never drags the form column's
                  scroll position with it.
                  w-[700px] fixed here (not the outer's max-w-[700px])
                  — this inner div is what ClassicInvoiceLayout's
                  ResizeObserver actually measures, and it needs a
                  real, stable width to report while the OUTER box is
                  what's animating narrower; the outer's overflow-
                  hidden clips this down to the animated width. On a
                  narrow desktop viewport (e.g. MacBook Air) where 700
                  can't fit even fully expanded, the parent row's own
                  min-w-0 + this div's shrink (below) still let it
                  give way — matching the fix for that layout bug. */}
              <div className="w-[700px] min-w-0 shrink sticky top-6 max-h-[calc(100dvh-11rem)] overflow-y-auto">
                <InvoicePreview invoice={draftPreview} />
              </div>
            </div>
          )}
        </div>
      </Container>

      {/* -------------------- Bottom summary + submit -------------------- */}
      {/* Desktop: a floating blurred pill, same recipe as AppShell's
          MobileTabBar (blur layer + theme-aware translucent bg +
          border), swapped from icon-only tabs to a Total readout +
          submit button. `fixed` (not `sticky`) and centered
          independently of Container's own scroll, so it floats above
          the page like the tab bar does — the `pb-32` already
          reserved on the scrollable content above covers its
          footprint.
          Mobile: stays a plain full-width bar in normal flow, NOT
          fixed — AppShell already renders its own fixed MobileTabBar
          at the bottom on every page under 768px width, and a second
          fixed bar here would float on top of / collide with it. */}
      {isDesktopLayout ? (
        <div className="fixed inset-x-0 bottom-6 z-20 flex justify-center px-6 pointer-events-none">
          <div className="relative w-full max-w-desktop flex justify-center pointer-events-none">
            <div className="relative min-w-[420px] flex flex-row items-center gap-4 rounded-full border border-border pl-8 pr-4 py-3 overflow-hidden pointer-events-auto">
              <div
                className={cn(
                  "absolute inset-0 z-0",
                  theme === "dark" ? "bg-background/60" : "bg-background/70",
                )}
                style={{ backdropFilter: "blur(16px)" }}
              />

              <div className="relative z-10 flex-1 flex flex-col gap-0.5">
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
                className="relative z-10"
              />
            </div>
          </div>
        </div>
      ) : (
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
      )}

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

      <InfoDialog
        visible={showCustomizableComingSoon}
        title="Coming Soon"
        message="The Customizable template is still being built. It'll be available to select here soon."
        onDismiss={() => setShowCustomizableComingSoon(false)}
      />
    </div>
  );
}

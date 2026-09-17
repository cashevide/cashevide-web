import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Funnel, Plus, X } from "lucide-react";

import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { SearchInput } from "../../../components/ui/SearchInput";
import { Spinner } from "../../../components/ui/Spinner";
import { PillTabs } from "../../../components/ui/PillTabs";
import { CreditPointsWidget } from "../../../components/ui/CreditPointsWidget";
import { InvoiceSubTabs } from "./InvoiceSubTabs";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { InvoiceFilterModal, type InvoiceFilters } from "./InvoiceFilterModal";
import { useInvoices } from "../hooks/useInvoices";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { ROUTES } from "../../../lib/routes";
import { cn } from "../../../utils/cn";

import type { GetInvoicesParams } from "../api/invoicesApi";
import type { Invoice } from "../types/invoiceTypes";

const EMPTY_FILTERS: InvoiceFilters = {
  status: undefined,
  currency: undefined,
  from_issue_date: undefined,
  to_issue_date: undefined,
  from_due_date: undefined,
  to_due_date: undefined,
};

const ORDERING_OPTIONS: {
  key: NonNullable<GetInvoicesParams["ordering"]>;
  label: string;
}[] = [
  { key: "-created_at", label: "Newest" },
  { key: "-due_date", label: "Due Date" },
  { key: "-total_amount", label: "Amount" },
];

const STATUS_LABELS: Record<NonNullable<InvoiceFilters["status"]>, string> = {
  DRAFT: "Draft",
  UNPAID: "Unpaid",
  PARTIALLY_PAID: "Partially Paid",
  PAID: "Paid",
};

function formatAmount(amount: string, currency: string): string {
  return `${currency || ""} ${amount}`.trim();
}

// due_date is a plain "YYYY-MM-DD" string from the backend — Date parses
// that directly. Comparing against the start of today (not `new Date()`
// as-is) means an invoice due today doesn't get flagged overdue just
// because the current time is past midnight.
function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(dueDate) < today;
}

// One removable chip per active filter key — lets the person see (and
// clear) exactly what's narrowing the list without reopening the filter
// modal. Each chip carries the key it clears so onRemove can null out
// just that one field.
type FilterChip = { key: keyof InvoiceFilters; label: string };

function getFilterChips(filters: InvoiceFilters): FilterChip[] {
  const chips: FilterChip[] = [];

  if (filters.status) {
    chips.push({ key: "status", label: STATUS_LABELS[filters.status] });
  }
  if (filters.currency) {
    chips.push({ key: "currency", label: filters.currency });
  }
  if (filters.from_issue_date || filters.to_issue_date) {
    chips.push({
      key: "from_issue_date",
      label: `Issued ${filters.from_issue_date ?? "…"} – ${filters.to_issue_date ?? "…"}`,
    });
  }
  if (filters.from_due_date || filters.to_due_date) {
    chips.push({
      key: "from_due_date",
      label: `Due ${filters.from_due_date ?? "…"} – ${filters.to_due_date ?? "…"}`,
    });
  }

  return chips;
}

function SkeletonRow() {
  return (
    <div className="flex flex-col gap-2 border-b border-border py-3">
      <div className="flex flex-row items-center justify-between">
        <div className="h-4 w-20 rounded bg-muted" />
        <div className="h-5 w-16 rounded-full bg-muted" />
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="h-3 w-32 rounded bg-muted" />
        <div className="h-3 w-16 rounded bg-muted" />
      </div>
    </div>
  );
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const navigate = useNavigate();
  const itemCount = invoice.items.length;
  const overdue = invoice.status !== "PAID" && isOverdue(invoice.due_date);

  // Draft invoices aren't finalized yet — total_amount/balance_due can
  // look like odd or negative placeholder values at this stage (backend
  // recalculates once items are locked in), so showing them prominently
  // here would read as a real amount owed. A plain status line avoids
  // that confusion; the real numbers show once the invoice is actually
  // sent.
  const isDraft = invoice.status === "DRAFT";

  // PAID: the full amount is what mattered, and it's all been collected
  // — show total_amount. Everything else (UNPAID, PARTIALLY_PAID): what's
  // still owed is the number a freelancer actually needs at a glance, so
  // show balance_due instead — a partially-paid invoice showing its full
  // total would otherwise read as "still owe the whole thing."
  const amountLabel = invoice.status === "PAID" ? "Total" : "Balance Due";
  const amountValue =
    invoice.status === "PAID" ? invoice.total_amount : invoice.balance_due;

  return (
    <button
      type="button"
      onClick={() => navigate(ROUTES.invoices.detail(invoice.id))}
      className="flex flex-col gap-3 bg-card border border-border rounded-lg p-4 text-left cursor-pointer transition-colors duration-200 hover:bg-card/80 hover:border-border/60"
    >
      <div className="flex flex-row items-center gap-3 px-3">
        <Text variant="body-lg" className="flex-shrink truncate font-semibold">
          {invoice.name || "Untitled Client"}
        </Text>

        <Text
          variant="body-sm"
          className="flex-1 truncate text-muted-foreground"
        >
          {invoice.invoice_number}
          {itemCount > 0 &&
            ` · ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
        </Text>

        <InvoiceStatusBadge status={invoice.status} />
      </div>

      {isDraft ? (
        <Text variant="body-sm" className="text-muted-foreground px-3">
          Not sent yet
        </Text>
      ) : (
        <div className="flex flex-row items-center justify-between gap-2 px-3">
          <div className="flex flex-col gap-0.5">
            <Text variant="caption">{amountLabel}</Text>

            {!!invoice.due_date && (
              <Text
                variant="caption"
                className={overdue ? "text-destructive-text font-semibold" : ""}
              >
                {overdue ? "Overdue since " : "Due "}
                {invoice.due_date}
              </Text>
            )}
          </div>

          <Text variant="body-lg" className="font-semibold">
            {formatAmount(amountValue, invoice.currency)}
          </Text>
        </div>
      )}
    </button>
  );
}

export function InvoiceListContent() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [ordering, setOrdering] =
    useState<GetInvoicesParams["ordering"]>("-created_at");
  const [filters, setFilters] = useState<InvoiceFilters>(EMPTY_FILTERS);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  // Sentinel element at the bottom of the list — when it scrolls into
  // view, fetch the next page. This is web's equivalent of Expo's
  // FlatList onEndReached (which has no direct DOM equivalent); an
  // IntersectionObserver watching a marker div is the standard way to
  // implement the same "load more as you approach the bottom" behavior
  // on the web.
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const invoices = useInvoices({
    search: debouncedSearchText || undefined,
    ordering,
    ...filters,
  });

  // Refetch on mount only, matching InvoiceDashboardContent's pattern
  // (see that file for why: no focus-lifecycle event in React Router,
  // so a mount-time refetch covers "data might be stale from an earlier
  // visit" without a focus-tracking library).
  useEffect(() => {
    invoices.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = invoices;

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allInvoices: Invoice[] =
    invoices.data?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = invoices.data?.pages[0]?.count ?? 0;

  const chips = getFilterChips(filters);
  const filtersActive = chips.length > 0;
  const searchOrFilterActive = filtersActive || debouncedSearchText.length > 0;

  function removeChip(key: keyof InvoiceFilters) {
    if (key === "from_issue_date") {
      setFilters((prev) => ({
        ...prev,
        from_issue_date: undefined,
        to_issue_date: undefined,
      }));
      return;
    }
    if (key === "from_due_date") {
      setFilters((prev) => ({
        ...prev,
        from_due_date: undefined,
        to_due_date: undefined,
      }));
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    // min-h-0 + overflow-hidden alongside flex-1: a flex child defaults
    // to min-height:auto, which means it refuses to shrink below its own
    // content's natural height — even inside AppShell's already
    // height-constrained (h-screen/overflow-hidden) chain. min-h-0 lets
    // it shrink to the space AppShell actually gives it; overflow-hidden
    // (matching the same flex-1+overflow-hidden pairing AppShell.tsx uses
    // at every level of its own chain) clips this div to exactly that
    // space, so Container's flex-1 + overflow-y-auto below has a real,
    // bounded box to scroll within instead of pushing past this wrapper
    // and forcing the whole page (body) to scroll.
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader>
        <div className="flex flex-row items-center justify-between">
          <Text variant="heading">Invoices</Text>

          <CreditPointsWidget />
        </div>
      </ScreenHeader>

      {/* Fixed block: sub-tabs, search/filter, active-filter chips, sort
          tabs. Deliberately OUTSIDE Container's scroll area — only the
          invoice cards below should scroll. Sits between ScreenHeader and
          Container, same fixed-chrome role ScreenHeader plays; the list
          section below is the only part that scrolls. */}
      <div className="w-full mx-auto max-w-desktop px-6 pt-6 pb-4 flex flex-col gap-4">
        <InvoiceSubTabs />

        <div className="flex flex-row items-center gap-2">
          <SearchInput
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onClear={() => setSearchText("")}
            placeholder="Search by invoice #, name, email or phone"
            className="flex-1"
          />

          <button
            type="button"
            onClick={() => setFilterModalVisible(true)}
            className={cn(
              "h-12 w-12 flex items-center justify-center rounded-lg border cursor-pointer",
              filtersActive
                ? "bg-secondary border-border"
                : "bg-card border-border",
            )}
          >
            <Funnel
              size={20}
              className={
                filtersActive ? "text-foreground" : "text-muted-foreground"
              }
            />
          </button>
        </div>

        {chips.length > 0 && (
          <div className="flex flex-row flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                type="button"
                key={chip.key}
                onClick={() => removeChip(chip.key)}
                className="flex flex-row items-center gap-1.5 rounded-full bg-secondary border border-border pl-3 pr-2 py-1.5 cursor-pointer"
              >
                <Text variant="body-sm">{chip.label}</Text>
                <X size={14} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-row items-center justify-between gap-2">
          <PillTabs
            items={ORDERING_OPTIONS}
            activeKey={ordering ?? ORDERING_OPTIONS[0].key}
            onSelect={(key) =>
              setOrdering(key as GetInvoicesParams["ordering"])
            }
            layout="segmented"
          />

          {/* Sized to match PillTabs' segmented track exactly: h-7
              (28px) segment buttons sit inside p-1 (4px) padding, so
              the track's own outer height is 28 + 4 + 4 = 36px — h-9.
              rounded-md mirrors the track's own corner radius too, so
              this button reads as sitting on the same row rather than
              as a mismatched control dropped in beside it. */}
          <Button
            variant="brand"
            shape="md"
            className="h-9 min-w-0 shrink-0 px-3.5 rounded-md"
            title="New Invoice"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate(ROUTES.invoices.create)}
          />
        </div>

        {!invoices.isLoading && allInvoices.length > 0 && (
          <Text variant="caption" className="pl-1">
            {totalCount} {totalCount === 1 ? "invoice" : "invoices"}
          </Text>
        )}
      </div>

      <Container variant="desktop" scroll>
        <div className="flex flex-1 flex-col gap-3 px-6 pt-6 pb-6">
          {invoices.isLoading ? (
            <div>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : allInvoices.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-1">
              <Text variant="body-lg" className="font-semibold">
                {searchOrFilterActive
                  ? "No matching invoices"
                  : "No invoices yet"}
              </Text>
              <Text
                variant="body-sm"
                className="text-muted-foreground text-center max-w-[280px]"
              >
                {searchOrFilterActive
                  ? "Try a different search term or clear your filters."
                  : "Create your first invoice to get started."}
              </Text>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {allInvoices.map((invoice) => (
                <InvoiceRow key={invoice.id} invoice={invoice} />
              ))}

              {invoices.hasNextPage && (
                <div
                  ref={loadMoreRef}
                  className="flex items-center justify-center py-4"
                >
                  {invoices.isFetchingNextPage ? <Spinner size="sm" /> : null}
                </div>
              )}
            </div>
          )}
        </div>
      </Container>

      <InvoiceFilterModal
        visible={filterModalVisible}
        initialFilters={filters}
        onApply={setFilters}
        onDismiss={() => setFilterModalVisible(false)}
      />
    </div>
  );
}

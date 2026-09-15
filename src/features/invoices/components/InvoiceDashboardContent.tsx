import { useEffect, useState } from "react";

import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
import { CreditPointsDialog } from "../../../components/ui/CreditPointsDialog";
import { CreditBadge } from "../../../components/ui/CreditBadge";
import { MalayaliModePrompt } from "../../onboarding/components/MalayaliModePrompt";
import { useOnboardingPromptStore } from "../../../stores/onboardingPromptStore";
import { DashboardCurrencyTabs } from "./DashboardCurrencyTabs";
import { DashboardReceivedCard } from "./DashboardReceivedCard";
import { DashboardBalanceDueCard } from "./DashboardBalanceDueCard";
import { DashboardSummaryCard } from "./DashboardSummaryCard";
import { useInvoiceDashboard } from "../hooks/useInvoiceDashboard";
import { useBusinessProfile } from "../../business-profile/hooks/useBusinessProfile";
import { useUserProfile } from "../../profile/hooks/useUserProfile";
import { getAvailableCurrencies } from "../utils/invoiceDashboardUtils";

import type { InvoiceDashboardResponse } from "../types/invoiceDashboardTypes";

export function InvoiceDashboardContent() {
  const dashboard = useInvoiceDashboard();
  const businessProfile = useBusinessProfile();
  const userProfile = useUserProfile();
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const hasSeenMalayaliPrompt = useOnboardingPromptStore(
    (state) => state.hasSeenMalayaliPrompt,
  );

  // Refetch on mount only, matching Expo's useFocusEffect (which
  // refetched every time the screen regained focus) — React Router
  // doesn't have a focus-lifecycle event of its own, and refetching
  // once per full page-load covers the same "data might be stale from
  // an earlier visit" case without a focus-tracking library.
  useEffect(() => {
    dashboard.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Deliberate deviation from Expo, which used a Logo here (this
          screen's own special case). Since Dashboard is now its own
          top-level tab, a plain "Dashboard" title matches the standard
          ScreenHeader pattern every other tab page uses (Profile,
          Settings, etc.) — the credit-points badge stays on the right. */}
      <ScreenHeader containerVariant="desktop">
        <div className="flex flex-row items-center justify-between">
          <Text variant="heading">Dashboard</Text>

          <CreditBadge
            points={userProfile.data?.credit_points ?? 0}
            onClick={() => setIsCreditModalOpen(true)}
          />
        </div>
      </ScreenHeader>

      <Container variant="desktop" scroll>
        <div className="flex flex-col gap-6 px-6 py-6">
          {dashboard.isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner />
            </div>
          ) : dashboard.isError || !dashboard.data ? (
            <div className="flex items-center justify-center py-16">
              <Text variant="body" className="text-muted-foreground">
                Could not load dashboard data.
              </Text>
            </div>
          ) : (
            <DashboardContent
              data={dashboard.data}
              selectedCurrency={selectedCurrency}
              onSelectCurrency={setSelectedCurrency}
              preferredCurrency={businessProfile.data?.currency}
            />
          )}
        </div>
      </Container>

      <CreditPointsDialog
        visible={isCreditModalOpen}
        points={userProfile.data?.credit_points ?? 0}
        onDismiss={() => setIsCreditModalOpen(false)}
      />

      {/* Shown once, on first visit to the dashboard after signup —
          `hasSeenMalayaliPrompt` flips to true from inside the prompt
          itself once the person completes any branch of the flow, so
          this never reappears after that. Enabled here (unlike the
          Expo source, which ships this hardcoded off via
          MALAYALI_PROMPT_ENABLED = false) per explicit instruction to
          turn it on for the web build. */}
      {!hasSeenMalayaliPrompt && (
        <MalayaliModePrompt visible onComplete={() => {}} />
      )}
    </div>
  );
}

function DashboardContent({
  data,
  selectedCurrency,
  onSelectCurrency,
  preferredCurrency,
}: {
  data: InvoiceDashboardResponse;
  selectedCurrency: string | null;
  onSelectCurrency: (currency: string) => void;
  preferredCurrency?: string | null;
}) {
  const { revenue, balance_due } = data;
  const availableCurrencies = getAvailableCurrencies(
    [revenue.total, balance_due.total],
    preferredCurrency,
  );
  const activeCurrency = selectedCurrency ?? availableCurrencies[0] ?? null;

  if (availableCurrencies.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16">
        <Text variant="body-lg" className="font-semibold">
          No invoices yet
        </Text>
        <Text
          variant="body-sm"
          className="text-muted-foreground text-center max-w-[280px]"
        >
          Create your first invoice to start tracking revenue and outstanding
          balances.
        </Text>
        <div className="mt-2">
          <Button variant="primary" title="New Invoice" />
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardCurrencyTabs
        currencies={availableCurrencies}
        selectedCurrency={activeCurrency}
        onSelect={onSelectCurrency}
      />

      {activeCurrency ? (
        // Deliberate deviation from Expo's web layout, which was a
        // FIXED side-by-side arrangement at every width (columns just
        // got narrower on a small screen, cards never stacked).
        // "md:flex-row" here makes this genuinely responsive instead:
        // below the md breakpoint the two stat cards and the summary
        // card all stack in one vertical column; at md and above they
        // arrange into the two-column layout (stat cards stacked on
        // the left, summary card on the right, 1:3 width ratio).
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          <div className="flex flex-col gap-3 md:flex-1 md:self-start">
            <DashboardReceivedCard
              totalRevenue={revenue.total}
              currency={activeCurrency}
            />
            <DashboardBalanceDueCard
              totalBalanceDue={balance_due.total}
              currency={activeCurrency}
            />
          </div>

          <div className="md:flex-[3]">
            <DashboardSummaryCard
              thisMonth={revenue.this_month}
              lastMonth={revenue.last_month}
              lastThreeMonths={revenue.last_three_months}
              thisYear={revenue.this_year}
              lastYear={revenue.last_year}
              currency={activeCurrency}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

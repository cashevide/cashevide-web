import type { CurrencyAmountMap } from "../types/invoiceDashboardTypes";

// Returns the currency codes present across the revenue and balance-due
// buckets combined — used to drive the currency-tab selector. A currency
// only needs to appear in ONE bucket to show up as a tab.
//
// Order: the business profile's own currency first (if it's actually
// present in the data), then the rest sorted by total activity — revenue
// and balance due summed together — highest first. This puts the
// currency the freelancer actually invoices in day to day up front,
// with everything else ranked by how much they're actually using it
// rather than an arbitrary alphabetical order.
export function getAvailableCurrencies(
  buckets: CurrencyAmountMap[],
  preferredCurrency?: string | null,
): string[] {
  const currencySet = new Set<string>();

  for (const bucket of buckets) {
    for (const currency of Object.keys(bucket)) {
      currencySet.add(currency);
    }
  }

  const totals = new Map<string, number>();
  for (const currency of currencySet) {
    let total = 0;
    for (const bucket of buckets) {
      total += bucket[currency] ?? 0;
    }
    totals.set(currency, total);
  }

  const sorted = Array.from(currencySet).sort(
    (a, b) => (totals.get(b) ?? 0) - (totals.get(a) ?? 0),
  );

  if (preferredCurrency && currencySet.has(preferredCurrency)) {
    return [
      preferredCurrency,
      ...sorted.filter((currency) => currency !== preferredCurrency),
    ];
  }

  return sorted;
}

// Safely reads an amount for a currency out of a bucket — missing means no
// data for that currency in that time window, not zero, but 0 is the
// correct display fallback.
export function getAmountForCurrency(
  bucket: CurrencyAmountMap,
  currency: string,
): number {
  return bucket[currency] ?? 0;
}

export function isBucketEmpty(bucket: CurrencyAmountMap): boolean {
  return Object.keys(bucket).length === 0;
}

// Formats a plain number amount with the currency code prefixed — the
// dashboard-analytics endpoint returns numbers, not decimal strings (unlike
// Invoice's money fields), so this takes a number, not a string.
export function formatDashboardAmount(
  amount: number,
  currency: string,
): string {
  return `${currency} ${amount.toLocaleString()}`;
}

// Same formatting, split into parts — for hero-amount displays (the two
// stat cards). INR/USD show their symbol (the two currencies most
// Cashevide users deal with day to day); everything else falls back to
// the plain ISO code, same as before.
//
// isSymbol tells the caller how to render the two parts: a currency
// SYMBOL sits directly against the number at the same size with no gap
// ($1,000 — the standard typographic convention), while an ISO CODE (no
// symbol available) reads as a separate, smaller label before the
// amount (AED 1,000) since it's a multi-letter abbreviation, not a
// single glyph meant to look "attached" to the number.
const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
};

export function formatDashboardAmountParts(
  amount: number,
  currency: string,
): { currency: string; value: string; isSymbol: boolean } {
  const symbol = CURRENCY_SYMBOLS[currency];

  return {
    currency: symbol ?? currency,
    value: amount.toLocaleString(),
    isSymbol: symbol != null,
  };
}

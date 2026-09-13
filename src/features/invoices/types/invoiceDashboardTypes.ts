// GET /invoices/dashboard-analytics/
//
// Both `revenue` and `balance_due` are keyed by currency code (e.g. "INR",
// "USD") — NOT a fixed set of keys. A currency only appears as a key if
// there's actually data for it in that time bucket; "no data" means an
// empty object `{}`, not a missing key or zero. Check
// `Object.keys(bucket).length === 0` for an empty-state, and iterate
// `Object.entries(bucket)` to render amounts per currency.
//
// Note: unlike Invoice's money fields (subtotal/total_amount/etc, which
// are decimal STRINGS), these amounts come back as plain numbers.
export type CurrencyAmountMap = Record<string, number>;

export type DashboardRevenue = {
  total: CurrencyAmountMap;
  this_month: CurrencyAmountMap;
  last_month: CurrencyAmountMap;
  last_three_months: CurrencyAmountMap;
  this_year: CurrencyAmountMap;
  last_year: CurrencyAmountMap;
};

export type DashboardBalanceDue = {
  total: CurrencyAmountMap;
};

export type InvoiceDashboardResponse = {
  revenue: DashboardRevenue;
  balance_due: DashboardBalanceDue;
};

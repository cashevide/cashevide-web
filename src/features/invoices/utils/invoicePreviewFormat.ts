// Exact TS ports of the backend's `invoice_extras.py` template filters
// (invoices/templatetags/invoice_extras.py), used by classic.html when
// rendering the downloaded PDF. The classic preview on web is a pixel
// AND text replica of that PDF — every string these functions produce
// must match what the Django filter would output for the same input,
// not just look close. Keep this file's behavior in lockstep with
// invoice_extras.py; if a filter changes there, mirror the change here.

// -------------------- trim_decimal --------------------
// Backend: rounds to 2 decimal places, then strips trailing zeros and a
// trailing dot. "100.00" -> "100", "100.50" -> "100.5", "100.55" stays
// "100.55". An all-zero result ("0.00") strips down to "" and the
// backend's fallback kicks in, printing "0" — replicated below via the
// `|| "0"` after stripping.
//
// Money fields from the API already arrive as decimal strings (e.g.
// "1234.50"), so this takes string | number | null | undefined, same
// set of shapes trim_decimal's Python side accepts.
export function trimDecimal(value: string | number | null | undefined): string {
  if (value == null || value === "") {
    return "";
  }

  const rounded = Math.round(Number(value) * 100) / 100;
  if (Number.isNaN(rounded)) {
    return "";
  }

  const formatted = rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  return formatted || "0";
}

// -------------------- strip_scheme --------------------
// Backend: removes a leading http:// or https:// and a trailing slash.
// "https://cashevide.com/" -> "cashevide.com"
export function stripScheme(url: string | null | undefined): string {
  if (!url) {
    return "";
  }

  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

// -------------------- currency_symbol --------------------
// Backend: INR -> ₹, USD -> $, anything else -> the code itself,
// uppercased. Kept as its own map here (not shared with the dashboard's
// CURRENCY_SYMBOLS in invoiceDashboardUtils.ts) because the two filters
// have different fallback behavior — this one always returns something
// displayable (the code) for an unknown currency, matching the backend
// filter exactly, while the dashboard formatter treats "no symbol" as
// its own case.
const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
};

export function currencySymbol(code: string | null | undefined): string {
  if (!code) {
    return "";
  }

  const upper = code.toUpperCase();
  return CURRENCY_SYMBOLS[upper] ?? upper;
}

// -------------------- pluralize_unit --------------------
// Backend: "QTY" (or empty) -> "" (no unit label shown at all — a plain
// quantity like "3" needs no word after it). "HRS" -> Hour/Hours,
// "DAYS" -> Day/Days. Any other unit_type value falls back to itself
// with a trailing "s" for plural — matches the backend's fallback for
// a unit_type outside its known set.
//
// quantity accepts string | number since invoice items carry quantity
// as a decimal string from the API but this may also be called with a
// live numeric form value while editing.
const UNIT_LABELS: Record<string, string> = {
  HRS: "Hour",
  DAYS: "Day",
};

export function pluralizeUnit(
  unitType: string | null | undefined,
  quantity: string | number | null | undefined,
): string {
  if (!unitType || unitType === "QTY") {
    return "";
  }

  const label = UNIT_LABELS[unitType] ?? unitType;

  const qty = Number(quantity);
  const isOne = !Number.isNaN(qty) && qty === 1;

  return isOne ? label : `${label}s`;
}

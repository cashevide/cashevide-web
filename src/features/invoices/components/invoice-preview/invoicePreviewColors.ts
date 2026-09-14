// Invoice previews always render in light mode, regardless of the app's
// active theme — the backend-generated PDF is light-only, so the
// in-app preview must visually match it rather than following the
// app's theme-aware `bg-card` / `text-foreground` etc. Tailwind classes.
//
// These are the SAME light-mode RGB values from index.css's `:root`
// block, just hardcoded here instead of behind CSS custom properties.
// CSS variables like `var(--color-card)` still resolve correctly even
// in dark mode when referenced via a `style` prop — the values below
// are pinned copies precisely so they DON'T follow that switch.
//
// Do not use Tailwind className color utilities (bg-card, text-
// foreground, border-border, etc.) anywhere inside invoice-preview/ —
// use these constants via the `style` prop instead.
export const invoicePreviewColors = {
  background: "#fcfcfa",
  card: "#ffffff",
  cardForeground: "#0d0d0d",
  foreground: "#0d0d0d",
  mutedForeground: "#646460",
  border: "#e1e1dd",

  // Status badge tints/text — light-mode `:root` values from index.css,
  // matching Badge.tsx's variant colors exactly. Backgrounds are the base
  // color + "26" (15% alpha in 8-digit hex, same /15 opacity Badge.tsx
  // uses via Tailwind), text uses each color's dedicated `-text` token.
  statusDefaultBg: "#f0f0ee", // --color-muted
  statusDefaultText: "#646460", // --color-muted-foreground
  statusWarningBg: "#b4530926", // --color-warning + 15% alpha
  statusWarningText: "#b45309", // --color-warning-text
  statusInfoBg: "#377aff26", // --color-info + 15% alpha
  statusInfoText: "#1d5bcc", // --color-info-text
  statusSuccessBg: "#09ba3826", // --color-success + 15% alpha
  statusSuccessText: "#1a8938", // --color-success-text
} as const;

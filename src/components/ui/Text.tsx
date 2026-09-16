import { type ElementType, type ComponentPropsWithoutRef } from "react";

import { cn } from "../../utils/cn";

type TextVariant =
  | "display"
  | "title"
  | "heading"
  | "subheading"
  | "body-lg"
  | "body"
  | "body-sm"
  | "caption"
  | "overline"
  | "link"
  | "button";

const VARIANT_CLASS: Record<TextVariant, string> = {
  display: "text-4xl font-extrabold tracking-tight text-foreground",
  title: "text-3xl font-bold tracking-tight text-foreground",
  heading: "text-2xl font-semibold tracking-tight text-foreground",
  subheading: "text-xl font-semibold tracking-tight text-foreground",

  "body-lg": "text-lg font-medium text-foreground",
  body: "text-base text-foreground",
  "body-sm": "text-sm font-medium text-foreground",

  caption: "text-xs text-muted-foreground",
  overline: "text-xs uppercase tracking-widest font-bold text-muted-foreground",

  link: "text-sm font-medium text-link",
  button: "text-sm font-medium",
};

// Default tag per variant — keeps HTML semantic (h1 for "display", p for
// body text, etc.) without callers having to specify `as` every time.
// Pass `as` explicitly to override when the semantic default doesn't fit
// (e.g. a "display"-styled span inside a button).
const DEFAULT_TAG: Record<TextVariant, ElementType> = {
  display: "h1",
  title: "h2",
  heading: "h3",
  subheading: "h4",
  "body-lg": "p",
  body: "p",
  "body-sm": "p",
  caption: "span",
  overline: "span",
  link: "span",
  button: "span",
};

interface TextProps extends ComponentPropsWithoutRef<"p"> {
  as?: ElementType;
  variant?: TextVariant;
  className?: string;
  // Renders in Space Mono instead of Geist — for figures where
  // Geist's digits read too plain to sit comfortably as the focal
  // number on a card: invoice amounts, invoice numbers, dashboard
  // stats. Not meant for prose that happens to contain a digit or
  // two (a date inside a sentence, a count inline in a paragraph) —
  // only for numbers that are themselves the content being displayed.
  numeric?: boolean;
  // Renders in Anek Malayalam instead of Geist — for Malayali Mode's
  // Kerala-themed content spots (e.g. the dashboard promo card),
  // where the text itself switches to Malayalam and Geist has no
  // Malayalam glyphs. The caller decides when this applies (e.g.
  // DashboardPromoCard passing `malayalam={isMalayaliMode}`) — this
  // prop doesn't read the Malayali Mode store itself, since most
  // Text usages have nothing to do with that feature.
  malayalam?: boolean;
}

export function Text({
  as,
  className = "",
  variant = "body",
  numeric = false,
  malayalam = false,
  ...props
}: TextProps) {
  const Tag = as ?? DEFAULT_TAG[variant];

  // numeric wins if a caller somehow sets both — a figure should
  // stay in Space Mono even inside Malayali Mode content (e.g. an
  // amount quoted inside a Malayalam promo line), matching the
  // earlier decision that numeric text doesn't switch fonts for
  // Malayali Mode.
  const fontClass = numeric
    ? "font-numeric"
    : malayalam
      ? "font-malayalam"
      : "font-sans";

  return (
    <Tag
      className={cn(fontClass, VARIANT_CLASS[variant], className)}
      {...props}
    />
  );
}

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
}

export function Text({
  as,
  className = "",
  variant = "body",
  ...props
}: TextProps) {
  const Tag = as ?? DEFAULT_TAG[variant];

  return (
    <Tag
      className={cn("font-sans", VARIANT_CLASS[variant], className)}
      {...props}
    />
  );
}

// WhatsApp's brand glyph, inlined as SVG — lucide-react (this app's
// icon set) doesn't carry brand/logo icons (licensing reasons), so
// generic icon libraries can't cover this one. Fixed to WhatsApp's
// own brand green rather than following the app's foreground/muted
// icon-color convention, since this is a brand mark (like a payment
// provider's logo) rather than a UI icon.
const WHATSAPP_GREEN = "#25D366";

interface WhatsAppIconProps {
  size?: number;
  className?: string;
}

export function WhatsAppIcon({ size = 24, className }: WhatsAppIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={WHATSAPP_GREEN}
      className={className}
      role="img"
      aria-label="WhatsApp"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.48 1.32 5.01L2.05 22l5.25-1.38c1.47.8 3.13 1.22 4.74 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01C17.19 3.03 14.7 2 12.04 2zm0 18.15h-.01c-1.48 0-2.93-.4-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.183 8.183 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.24 8.23zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.17 1.72 2.62 4.16 3.68.58.25 1.04.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29z" />
    </svg>
  );
}

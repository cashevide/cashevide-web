import { useRef, useState, useLayoutEffect } from "react";

import { useBusinessProfile } from "../../../../features/business-profile/hooks/useBusinessProfile";
import { InvoicePreviewStatusBadge } from "./InvoicePreviewStatusBadge";

import type { InvoicePreviewData } from "../InvoicePreview";

type ClassicInvoiceLayoutProps = {
  invoice: InvoicePreviewData;
};

// This layout is a 1:1 pixel port of the backend's actual PDF template
// (invoice.html — @page A4, mm/pt units), not an independent design.
// Every dimension below is that template's mm/pt value converted to px
// at 96 DPI (1pt = 96/72px, 1mm = 96/25.4px) — the same math a
// browser's print engine uses for `size: A4`, and the same reference
// point the backend's PDF renderer uses. Colors are the template's
// exact hex values. Fonts are the browser default (system stack) for
// now, matching the Expo port's approach — sizes/weights are matched
// even though the typeface isn't yet.
const PX = {
  pageWidth: 794, // 210mm
  pageHeight: 1123, // 297mm
  marginX: 68, // 18mm
  marginTop: 76, // 20mm
  marginBottom: 76, // 20mm
  headerMarginBottom: 44, // 11.5mm
  logoMaxWidth: 213, // 160pt
  logoMaxHeight: 73, // 55pt
  titleSize: 97, // 73pt
  bodySize: 16, // 12pt (base)
  smallSize: 15, // 11pt
  nameSize: 19, // 14pt
  boldSize: 17, // 13pt
  companyMetaMarginBottom: 27, // 20pt
  companyNameMaxWidth: 427, // 320pt
  addressMaxWidth: 293, // 220pt
  clientAddressMaxWidth: 320, // 240pt
  billToPaddingV: 21, // 16pt
  billToPaddingH: 24, // 18pt
  billToMarginBottom: 27, // 20pt
  itemTableMarginBottom: 27, // 20pt
  barHeight: 32, // 24pt (table header row height, total-amount bar, footer bar)
  cellPaddingXHeader: 16, // 12pt
  cellPaddingYBody: 12, // 9pt
  totalsRowWidth: 293, // 220pt
  totalsGap: 8, // 6pt
  totalsMarginBottom: 27, // 20pt
} as const;

const COLORS = {
  cardBg: "#f2f2f2",
  heading: "#000000",
  text: "#2d2d2d",
  white: "#ffffff",
} as const;

// Always light/fixed — this is a pixel-locked replica of a print
// document, not a themed UI screen, so it never reads from the app's
// dark/light color tokens.
export function ClassicInvoiceLayout({ invoice }: ClassicInvoiceLayoutProps) {
  const liveBusinessProfile = useBusinessProfile();
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // The canvas below is always rendered at its true fixed size
  // (794x1123px) — never resized to fit its container — and this
  // wrapper instead scales that whole canvas down/up uniformly with a
  // CSS transform, the same way a PDF viewer zooms a fixed page rather
  // than reflowing its text. ResizeObserver is the web equivalent of
  // Expo's onLayout: it reports the space actually available (whatever
  // column width the surrounding page gives it), and dividing that by
  // the canvas's true width gives the scale factor.
  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const availableWidth = entries[0]?.contentRect.width;
      if (availableWidth && availableWidth > 0) {
        setScale(availableWidth / PX.pageWidth);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // A saved invoice (has an id) carries a frozen business_snapshot
  // from creation time — that snapshot is the ONLY source used for it,
  // even if it's somehow empty, so this preview always matches what
  // download_pdf on the backend would actually render. Only an
  // unsaved draft (no id yet) falls back to the live profile, since
  // that's genuinely the data the backend will snapshot on first save.
  const isSavedInvoice = invoice.id != null;
  const snapshot = invoice.business_snapshot;

  const businessName = isSavedInvoice
    ? snapshot?.business_name
    : liveBusinessProfile.data?.business_name;
  const businessLogo = isSavedInvoice
    ? snapshot?.logo
    : liveBusinessProfile.data?.logo;
  const businessAddress = isSavedInvoice
    ? snapshot?.address
    : liveBusinessProfile.data?.address;
  const businessEmail = isSavedInvoice
    ? snapshot?.business_email
    : liveBusinessProfile.data?.business_email;
  const businessPhone = isSavedInvoice
    ? snapshot?.phone_number
    : liveBusinessProfile.data?.phone_number;
  const businessWebsite = isSavedInvoice
    ? snapshot?.website
    : liveBusinessProfile.data?.website;

  const hasLogo = !!businessLogo;
  const hasBusinessAddress = !!businessAddress;
  const hasBusinessEmail = !!businessEmail;
  const hasBusinessPhone = !!businessPhone;
  const hasClientAddress = !!invoice.address;
  const hasClientPhone = !!invoice.phone;
  const hasDiscount = Number(invoice.discount) > 0;
  const hasAmountPaid =
    invoice.amount_paid != null && Number(invoice.amount_paid) > 0;

  return (
    <div ref={wrapperRef} style={{ height: PX.pageHeight * scale }}>
      <div
        style={{
          width: PX.pageWidth,
          minHeight: PX.pageHeight,
          backgroundColor: COLORS.white,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "relative",
        }}
      >
        <div
          style={{
            paddingLeft: PX.marginX,
            paddingRight: PX.marginX,
            paddingTop: PX.marginTop,
            paddingBottom: PX.marginBottom + PX.barHeight,
          }}
        >
          {/* -------------------- Header: logo + big "Invoice" title -------------------- */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: PX.headerMarginBottom,
            }}
          >
            {hasLogo ? (
              <img
                src={businessLogo ?? undefined}
                alt={businessName || "Business logo"}
                style={{
                  maxWidth: PX.logoMaxWidth,
                  maxHeight: PX.logoMaxHeight,
                  width: PX.logoMaxWidth,
                  height: PX.logoMaxHeight,
                  objectFit: "contain",
                }}
              />
            ) : (
              <div />
            )}
            <span
              style={{
                fontSize: PX.titleSize,
                fontWeight: 400,
                color: COLORS.heading,
                lineHeight: `${PX.titleSize}px`,
              }}
            >
              Invoice
            </span>
          </div>

          {/* -------------------- Company meta: business info + invoice meta -------------------- */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: PX.companyMetaMarginBottom,
            }}
          >
            <div style={{ maxWidth: PX.companyNameMaxWidth }}>
              <div
                style={{
                  fontSize: PX.nameSize,
                  fontWeight: 700,
                  color: COLORS.heading,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {businessName || "Your Business"}
              </div>
              {hasBusinessAddress && (
                <div
                  style={{
                    fontSize: PX.bodySize,
                    color: COLORS.text,
                    maxWidth: PX.addressMaxWidth,
                    marginBottom: 8,
                  }}
                >
                  {businessAddress}
                </div>
              )}
              {hasBusinessEmail && (
                <div
                  style={{
                    fontSize: PX.bodySize,
                    color: COLORS.text,
                    maxWidth: PX.addressMaxWidth,
                    marginBottom: 5,
                  }}
                >
                  {businessEmail}
                </div>
              )}
              {hasBusinessPhone && (
                <div
                  style={{
                    fontSize: PX.boldSize,
                    fontWeight: 700,
                    color: COLORS.text,
                    maxWidth: PX.addressMaxWidth,
                  }}
                >
                  {businessPhone}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 5,
              }}
            >
              <div
                style={{
                  fontSize: PX.nameSize,
                  fontWeight: 700,
                  color: COLORS.text,
                }}
              >
                {invoice.invoice_number ?? "—"}
              </div>
              <div style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                Issue Date: {invoice.issue_date ?? "—"}
              </div>
              <div style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                Due Date: {invoice.due_date ?? "—"}
              </div>
            </div>
          </div>

          {/* -------------------- Bill To card -------------------- */}
          <div
            style={{
              backgroundColor: COLORS.cardBg,
              paddingTop: PX.billToPaddingV,
              paddingBottom: PX.billToPaddingV,
              paddingLeft: PX.billToPaddingH,
              paddingRight: PX.billToPaddingH,
              marginBottom: PX.billToMarginBottom,
            }}
          >
            <div
              style={{
                fontSize: PX.bodySize,
                fontWeight: 700,
                color: COLORS.heading,
                marginBottom: 8,
              }}
            >
              BILL TO:
            </div>
            <div
              style={{
                fontSize: PX.bodySize,
                fontWeight: 600,
                color: COLORS.heading,
                marginBottom: 5,
              }}
            >
              {invoice.name || "Untitled Client"}
            </div>
            {hasClientAddress && (
              <div
                style={{
                  fontSize: PX.bodySize,
                  color: COLORS.text,
                  maxWidth: PX.clientAddressMaxWidth,
                  marginBottom: 8,
                }}
              >
                {invoice.address}
              </div>
            )}
            {hasClientPhone && (
              <div
                style={{
                  fontSize: PX.boldSize,
                  fontWeight: 700,
                  color: COLORS.text,
                }}
              >
                {invoice.phone}
              </div>
            )}
          </div>

          {/* -------------------- Item table -------------------- */}
          <div style={{ marginBottom: PX.itemTableMarginBottom }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: COLORS.heading,
                height: PX.barHeight,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  flex: 2,
                  color: COLORS.white,
                  fontSize: PX.bodySize,
                  fontWeight: 700,
                  paddingLeft: PX.cellPaddingXHeader,
                  paddingRight: PX.cellPaddingXHeader,
                }}
              >
                ITEM
              </span>
              <span
                style={{
                  flex: 1,
                  color: COLORS.white,
                  fontSize: PX.bodySize,
                  fontWeight: 700,
                  paddingLeft: PX.cellPaddingXHeader,
                  paddingRight: PX.cellPaddingXHeader,
                }}
              >
                QTY
              </span>
              <span
                style={{
                  flex: 1,
                  color: COLORS.white,
                  fontSize: PX.bodySize,
                  fontWeight: 700,
                  paddingLeft: PX.cellPaddingXHeader,
                  paddingRight: PX.cellPaddingXHeader,
                }}
              >
                PRICE
              </span>
              <span
                style={{
                  flex: 1,
                  color: COLORS.white,
                  fontSize: PX.bodySize,
                  fontWeight: 700,
                  paddingLeft: PX.cellPaddingXHeader,
                  paddingRight: PX.cellPaddingXHeader,
                  textAlign: "right",
                }}
              >
                TOTAL
              </span>
            </div>

            {invoice.items.map((item, index) => {
              const isEvenRow = index % 2 === 1; // template: nth-child(even)

              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: isEvenRow ? COLORS.cardBg : COLORS.white,
                    paddingTop: PX.cellPaddingYBody,
                    paddingBottom: PX.cellPaddingYBody,
                  }}
                >
                  <span
                    style={{
                      flex: 2,
                      fontSize: PX.bodySize,
                      color: COLORS.text,
                      paddingLeft: PX.cellPaddingXHeader,
                      paddingRight: PX.cellPaddingXHeader,
                    }}
                  >
                    {item.title || "—"}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: PX.bodySize,
                      color: COLORS.text,
                      paddingLeft: PX.cellPaddingXHeader,
                      paddingRight: PX.cellPaddingXHeader,
                    }}
                  >
                    {item.quantity || "—"}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: PX.bodySize,
                      color: COLORS.text,
                      paddingLeft: PX.cellPaddingXHeader,
                      paddingRight: PX.cellPaddingXHeader,
                    }}
                  >
                    {item.unit_price || "—"}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: PX.bodySize,
                      color: COLORS.text,
                      paddingLeft: PX.cellPaddingXHeader,
                      paddingRight: PX.cellPaddingXHeader,
                      textAlign: "right",
                    }}
                  >
                    {item.total || "—"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* -------------------- Totals -------------------- */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: PX.totalsGap,
              marginBottom: PX.totalsMarginBottom,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: PX.totalsRowWidth,
                paddingLeft: PX.cellPaddingXHeader,
                paddingRight: PX.cellPaddingXHeader,
              }}
            >
              <span style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                Subtotal
              </span>
              <span style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                {invoice.subtotal}
              </span>
            </div>

            {hasDiscount && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: PX.totalsRowWidth,
                  paddingLeft: PX.cellPaddingXHeader,
                  paddingRight: PX.cellPaddingXHeader,
                }}
              >
                <span style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                  Discount
                </span>
                <span style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                  {invoice.discount}
                </span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: PX.totalsRowWidth,
                paddingLeft: PX.cellPaddingXHeader,
                paddingRight: PX.cellPaddingXHeader,
              }}
            >
              <span style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                Total amount
              </span>
              <span style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                {invoice.total_amount}
              </span>
            </div>

            {hasAmountPaid && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: PX.totalsRowWidth,
                  paddingLeft: PX.cellPaddingXHeader,
                  paddingRight: PX.cellPaddingXHeader,
                }}
              >
                <span style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                  Amount Paid
                </span>
                <span style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                  {invoice.amount_paid}
                </span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: PX.totalsRowWidth,
                backgroundColor: COLORS.heading,
                height: PX.barHeight,
                paddingLeft: PX.cellPaddingXHeader,
                paddingRight: PX.cellPaddingXHeader,
                marginTop: 5,
              }}
            >
              <span style={{ fontSize: PX.bodySize, color: COLORS.white }}>
                Balance Due
              </span>
              <span
                style={{
                  fontSize: PX.bodySize,
                  fontWeight: 700,
                  color: COLORS.white,
                }}
              >
                {invoice.currency} {invoice.balance_due ?? invoice.total_amount}
              </span>
            </div>
          </div>

          {invoice.status && (
            <div style={{ position: "absolute", top: 0, right: 0 }}>
              <InvoicePreviewStatusBadge status={invoice.status} />
            </div>
          )}
        </div>

        {/* -------------------- Footer bar -------------------- */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: PX.barHeight,
            backgroundColor: COLORS.heading,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!!businessWebsite && (
            <span style={{ color: COLORS.white, fontSize: PX.smallSize }}>
              {businessWebsite}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

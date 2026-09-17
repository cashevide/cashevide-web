import { useRef, useState, useLayoutEffect } from "react";

import { useBusinessProfile } from "../../../../features/business-profile/hooks/useBusinessProfile";
import {
  currencySymbol,
  pluralizeUnit,
  stripScheme,
  trimDecimal,
} from "../../utils/invoicePreviewFormat";
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
// point the backend's PDF renderer uses. Colors and fonts are the
// template's exact values — see FONTS below and the Geist/Poppins/
// Orange Avenue DEMO @font-face rules in index.css.
const PX = {
  pageWidth: 794, // 210mm
  pageHeight: 1123, // 297mm
  marginX: 68, // 18mm
  marginTop: 76, // 20mm
  marginBottom: 76, // 20mm
  headerMarginBottom: 44, // 11.64mm
  logoMaxWidth: 213, // 160pt
  logoMaxHeight: 73, // 55pt
  titleSize: 97, // 73pt
  bodySize: 16, // 12pt (base)
  smallSize: 15, // 11pt
  nameSize: 19, // 14pt
  boldSize: 17, // 13pt
  addressLineHeight: 19, // 14pt — .company-address / .client-address
  companyMetaMarginBottom: 24, // 18pt
  companyNameMaxWidth: 427, // 320pt
  addressMaxWidth: 293, // 220pt
  clientAddressMaxWidth: 320, // 240pt
  billToPaddingV: 21, // 16pt
  billToPaddingH: 24, // 18pt
  billToMarginBottom: 24, // 18pt
  itemTableMarginBottom: 27, // 20pt
  barHeight: 32, // 24pt (--bar-height: table header row, totals bar, footer bar)
  rowHeight: 37, // 28pt (--row-height: item-table body row height)
  cellPaddingX: 11, // 8pt — .item-table th/td AND .totals-row shared
  // horizontal cell padding. NOT the same as billToPaddingH (18pt) —
  // easy to conflate since both are "cell-ish" paddings but the
  // backend uses two different pt values here.
  totalsRowGap: 13, // 10pt — .totals-row's own margin-bottom (gap
  // between Subtotal/Discount/Total amount/Amount Paid rows)
  balanceDueMarginTop: 19, // 14pt — .balance-due-row's margin-top
  totalsRowWidth: 293, // 220pt
  // Backend: .totals { margin-bottom: calc(20pt + var(--bar-height) +
  // 15mm) } — that's PDF page-break reservation space (keeps the
  // balance-due bar from splitting across a printed page), not a
  // visual spacing value. A web preview has no page breaks, so
  // copying it verbatim would leave a large, wrong gap before the
  // footer. This uses just the base 20pt instead.
  totalsMarginBottom: 27, // 20pt (web-equivalent, see note above)
} as const;

const COLORS = {
  cardBg: "#f2f2f2",
  heading: "#000000",
  text: "#2d2d2d",
  white: "#ffffff",
} as const;

// classic.html's exact font-family assignments (see @font-face rules in
// index.css). Geist is the body default — only elements the backend
// CSS explicitly overrides need FONTS.poppins / FONTS.orangeAvenue set
// below; everything else inherits Geist via the outer wrapper.
const FONTS = {
  geist: '"Geist", sans-serif',
  poppins: '"Poppins", sans-serif',
  orangeAvenue: '"Orange Avenue DEMO", serif',
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
          fontFamily: FONTS.geist,
          // Backend: body { line-height: 1.2 } — this is the page-wide
          // default every text element inherits unless it sets its own
          // (like .company-address / .client-address's line-height:
          // 14pt, or .invoice-title's line-height: 1). Without this,
          // every other element (client-name, bill-to-label, company-
          // name, issue/due date, etc.) falls back to the browser's
          // own default line-height instead, which is close but not
          // exact — causing small but real gap mismatches wherever
          // margins stack against text height.
          lineHeight: 1.2,
          display: "flex",
          flexDirection: "column",
          // @page { margin: 20mm 18mm } in classic.html — this is a PDF
          // page margin, which insets the ENTIRE printable area (body,
          // including the footer bar) from the physical page edge. It
          // is NOT a padding on .invoice-content alone — that class has
          // no padding of its own in the backend CSS. So this goes on
          // the outermost page canvas, wrapping content AND footer.
          paddingLeft: PX.marginX,
          paddingRight: PX.marginX,
          paddingTop: PX.marginTop,
          paddingBottom: PX.marginBottom,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* .invoice-content: flex: 1 0 auto — grows to fill the page when
            content is short (pushing the footer to the true bottom), and
            simply pushes the footer below it when content overflows a
            single page's worth of items, instead of the footer ever
            overlapping the content. No padding of its own — the page
            margin above already accounts for it. */}
        <div style={{ flex: "1 0 auto" }}>
          {/* -------------------- Header: logo + big "Invoice" title -------------------- */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              // .invoice-header's own 11.64mm margin-bottom. The
              // backend's .invoice-title also has margin-bottom: -20pt,
              // but that value assumes the PDF renderer's glyph metrics
              // for Orange Avenue DEMO — this browser's metrics for the
              // same font differ (see the wrapper div below), so the
              // -30 visual correction on that wrapper already accounts
              // for the net effect here. Do NOT also subtract
              // titleMarginBottom on this row — that double-applies the
              // same correction and pulls company-meta up too far.
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
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div />
            )}
            {/* Orange Avenue DEMO has an unusually large font descent
                (500/1000 em — verified via font metrics), so even with
                line-height: 1 the glyphs sit visually high inside their
                line box, leaving a large empty gap below the text. That
                gap pushes the title's flex-end baseline well below the
                logo's actual bottom edge. This wrapper's negative
                margin pulls that empty descent space back so the two
                align on their true visual bottoms, matching what
                align-items: flex-end looks like in the backend's PDF
                (where the same font is used but the renderer's glyph
                metrics don't leave this same visual gap). -30 is the
                visually-verified value (the raw font-metric calc gave
                -48, but the browser's actual rendered gap needed less
                correction than that). */}
            <div style={{ marginBottom: -30 }}>
              <span
                style={{
                  fontFamily: FONTS.orangeAvenue,
                  fontSize: PX.titleSize,
                  fontWeight: 400,
                  color: COLORS.heading,
                  lineHeight: 1,
                }}
              >
                Invoice
              </span>
            </div>
          </div>

          {/* -------------------- Company meta: business info + invoice meta -------------------- */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "stretch",
              marginBottom: PX.companyMetaMarginBottom,
            }}
          >
            <div style={{ maxWidth: PX.companyNameMaxWidth }}>
              <div
                style={{
                  fontFamily: FONTS.poppins,
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
                    lineHeight: `${PX.addressLineHeight}px`,
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
                    marginBottom: 8,
                  }}
                >
                  {businessEmail}
                </div>
              )}
              {hasBusinessPhone && (
                <div
                  style={{
                    fontFamily: FONTS.poppins,
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
                justifyContent: "space-between",
              }}
            >
              {/* .invoice-number: plain Geist 12pt "Invoice No.: " label,
                  its <span> child is Poppins 700 12pt for the number itself */}
              <div style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                Invoice No.:{" "}
                <span
                  style={{
                    fontFamily: FONTS.poppins,
                    fontWeight: 700,
                  }}
                >
                  {invoice.invoice_number ?? "—"}
                </span>
              </div>
              {invoice.status && (
                <InvoicePreviewStatusBadge
                  status={invoice.status}
                  palette="classic"
                />
              )}
            </div>
          </div>

          {/* -------------------- Bill To card -------------------- */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              background: `linear-gradient(90deg, ${COLORS.cardBg} 0%, rgba(242, 242, 242, 0) 100%)`,
              paddingTop: PX.billToPaddingV,
              paddingBottom: PX.billToPaddingV,
              paddingLeft: PX.billToPaddingH,
              paddingRight: 0,
              marginBottom: PX.billToMarginBottom,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: FONTS.poppins,
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
                  fontFamily: FONTS.geist,
                  fontSize: PX.bodySize,
                  fontWeight: 400,
                  color: COLORS.text,
                  marginBottom: 8,
                }}
              >
                {invoice.name || "Untitled Client"}
              </div>
              {hasClientAddress && (
                <div
                  style={{
                    fontSize: PX.bodySize,
                    lineHeight: `${PX.addressLineHeight}px`,
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
                    fontFamily: FONTS.geist,
                    fontSize: PX.bodySize,
                    fontWeight: 400,
                    color: COLORS.text,
                  }}
                >
                  {invoice.phone}
                </div>
              )}
            </div>

            {/* .invoice-meta: issue/due date column — lives inside the
                bill-to section on the backend, NOT next to the invoice
                number (that was this component's earlier mistake). */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 5,
              }}
            >
              <div style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                Issue Date: {invoice.issue_date ?? "—"}
              </div>
              <div style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                Due Date: {invoice.due_date ?? "—"}
              </div>
            </div>
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
                fontFamily: FONTS.poppins,
              }}
            >
              <span
                style={{
                  flex: 2,
                  color: COLORS.white,
                  fontSize: PX.bodySize,
                  fontWeight: 700,
                  paddingLeft: PX.cellPaddingX,
                  paddingRight: PX.cellPaddingX,
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
                  paddingLeft: PX.cellPaddingX,
                  paddingRight: PX.cellPaddingX,
                  textAlign: "center",
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
                  paddingLeft: PX.cellPaddingX,
                  paddingRight: PX.cellPaddingX,
                  textAlign: "center",
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
                  paddingLeft: PX.cellPaddingX,
                  paddingRight: PX.cellPaddingX,
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
                    alignItems: "center",
                    backgroundColor: isEvenRow ? COLORS.cardBg : COLORS.white,
                    height: PX.rowHeight,
                  }}
                >
                  <span
                    style={{
                      flex: 2,
                      fontSize: PX.bodySize,
                      color: COLORS.text,
                      paddingLeft: PX.cellPaddingX,
                      paddingRight: PX.cellPaddingX,
                    }}
                  >
                    {item.title || "—"}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: PX.bodySize,
                      color: COLORS.text,
                      paddingLeft: PX.cellPaddingX,
                      paddingRight: PX.cellPaddingX,
                      textAlign: "center",
                    }}
                  >
                    {[
                      trimDecimal(item.quantity),
                      pluralizeUnit(item.unit_type, item.quantity),
                    ]
                      .filter(Boolean)
                      .join(" ") || "—"}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: PX.bodySize,
                      color: COLORS.text,
                      paddingLeft: PX.cellPaddingX,
                      paddingRight: PX.cellPaddingX,
                      textAlign: "center",
                    }}
                  >
                    {trimDecimal(item.unit_price) || "—"}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: PX.bodySize,
                      color: COLORS.text,
                      paddingLeft: PX.cellPaddingX,
                      paddingRight: PX.cellPaddingX,
                      textAlign: "right",
                    }}
                  >
                    {trimDecimal(item.total) || "—"}
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
              gap: PX.totalsRowGap,
              marginBottom: PX.totalsMarginBottom,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: PX.totalsRowWidth,
                paddingLeft: PX.cellPaddingX,
                paddingRight: PX.cellPaddingX,
              }}
            >
              <span style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                Subtotal
              </span>
              <span style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                {trimDecimal(invoice.subtotal)}
              </span>
            </div>

            {hasDiscount && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: PX.totalsRowWidth,
                  paddingLeft: PX.cellPaddingX,
                  paddingRight: PX.cellPaddingX,
                }}
              >
                <span style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                  Discount
                </span>
                <span style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                  {trimDecimal(invoice.discount)}
                </span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: PX.totalsRowWidth,
                paddingLeft: PX.cellPaddingX,
                paddingRight: PX.cellPaddingX,
              }}
            >
              <span style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                Total amount
              </span>
              <span style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                {trimDecimal(invoice.total_amount)}
              </span>
            </div>

            {hasAmountPaid && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: PX.totalsRowWidth,
                  paddingLeft: PX.cellPaddingX,
                  paddingRight: PX.cellPaddingX,
                }}
              >
                <span style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                  Amount Paid
                </span>
                <span style={{ fontSize: PX.bodySize, color: COLORS.text }}>
                  {trimDecimal(invoice.amount_paid)}
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
                paddingLeft: PX.cellPaddingX,
                paddingRight: PX.cellPaddingX,
                marginTop: PX.balanceDueMarginTop,
              }}
            >
              <span style={{ fontSize: PX.bodySize, color: COLORS.white }}>
                Balance Due
              </span>
              <span
                style={{
                  fontFamily: FONTS.poppins,
                  fontSize: PX.bodySize,
                  fontWeight: 700,
                  color: COLORS.white,
                }}
              >
                {currencySymbol(invoice.currency)}{" "}
                {trimDecimal(invoice.balance_due ?? invoice.total_amount)}
              </span>
            </div>
          </div>
        </div>
        {/* -------------------- Footer bar -------------------- */}
        <div
          style={{
            flexShrink: 0,
            height: PX.barHeight,
            backgroundColor: COLORS.heading,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 16, // 12pt
            paddingRight: 16, // 12pt
          }}
        >
          {!!businessWebsite && (
            <span style={{ color: COLORS.white, fontSize: PX.smallSize }}>
              {stripScheme(businessWebsite)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

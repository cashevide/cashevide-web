import type {
  InvoiceBusinessSnapshot,
  InvoiceStatus,
  InvoiceTemplate,
} from "../types/invoiceTypes";
import { ClassicInvoiceLayout } from "./invoice-preview/ClassicInvoiceLayout";
import { CustomizableInvoiceLayout } from "./invoice-preview/CustomizableInvoiceLayout";

// A subset of the full Invoice shape, loose enough to also describe a
// draft that hasn't been saved yet (no id/invoice_number/status from
// the backend). The create screen builds one of these from live form
// state; the detail/edit screens can pass a real saved Invoice
// directly, since Invoice is a superset of this.
//
// `id` is the signal the layouts use to decide where business details
// come from: absent means an unsaved draft (no business_snapshot
// exists yet, so live business profile data is shown — matching what
// the backend will actually snapshot on save). Present means a real
// saved invoice, in which case business_snapshot is the ONLY source
// used — never fall back to live data here, or the preview would show
// something the downloaded PDF won't match.
export type InvoicePreviewData = {
  id?: number;
  invoice_number?: string;
  status?: InvoiceStatus;
  template?: InvoiceTemplate;
  business_snapshot?: InvoiceBusinessSnapshot;
  currency: string;
  issue_date?: string | null;
  due_date?: string | null;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  items: {
    id: number | string;
    title: string;
    quantity: string;
    unit_type: "QTY" | "HRS" | "DAYS";
    unit_price: string;
    total: string;
  }[];
  subtotal: string;
  discount: string;
  total_amount: string;
  amount_paid?: string;
  balance_due?: string;
};

type InvoicePreviewProps = {
  invoice: InvoicePreviewData;
};

// Pure router — picks the layout matching invoice.template and renders
// it. No JSX or styling of its own, so a new template only ever means
// adding one more case here plus a new file under invoice-preview/,
// never touching the two layouts that already exist.
//
// Defaults to "classic" when template is missing (e.g. an older draft
// preview built before this field existed) — matches the backend's own
// default.
export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const template = invoice.template ?? "classic";

  switch (template) {
    case "customizable":
      return <CustomizableInvoiceLayout invoice={invoice} />;
    case "classic":
    default:
      return <ClassicInvoiceLayout invoice={invoice} />;
  }
}

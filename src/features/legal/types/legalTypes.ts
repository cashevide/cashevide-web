export type LegalDocumentType = "TERMS" | "PRIVACY";

export type LegalDocument = {
  id: number;
  document_type: LegalDocumentType;
  version: string;
  content: string;
  effective_date: string;
  updated_at: string;
};

export type LegalDocumentNotFoundError = {
  detail: string;
};

export type AcceptLegalDocumentsRequest = {
  legal_doc_ids: number[];
};

export type AcceptLegalDocumentsResponse = {
  detail: string;
};

export type AcceptLegalDocumentsError = {
  legal_doc_ids?: string[];
};

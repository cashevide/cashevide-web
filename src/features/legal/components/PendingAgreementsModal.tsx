import { useState } from "react";

import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
import { Modal } from "../../../components/ui/Modal";
import { MarkdownContent } from "./MarkdownContent";
import { useAcceptLegalDocuments } from "../hooks/useAcceptLegalDocuments";
import { useLegalDocument } from "../hooks/useLegalDocument";

import type { PendingLegalDoc } from "../../profile/types/userProfileTypes";
import type { LegalDocumentType } from "../types/legalTypes";

type PendingAgreementsModalProps = {
  visible: boolean;
  pendingLegalDocs: PendingLegalDoc[];
};

type ExpandableSectionProps = {
  title: string;
  docType: LegalDocumentType;
  isExpanded: boolean;
  onToggle: () => void;
};

function ExpandableSection({
  title,
  docType,
  isExpanded,
  onToggle,
}: ExpandableSectionProps) {
  const legalDocumentQuery = useLegalDocument(
    isExpanded ? docType.toLowerCase() : "",
  );

  return (
    <div className="border-t border-border">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex flex-row justify-between items-center py-3 cursor-pointer"
      >
        <Text variant="body-sm">{title}</Text>
        <Text variant="body-sm">{isExpanded ? "−" : "+"}</Text>
      </button>

      {isExpanded && (
        <div className="pb-3">
          {legalDocumentQuery.isLoading ? (
            <Spinner size="sm" />
          ) : legalDocumentQuery.isError ? (
            <Text variant="body-sm" className="text-destructive-text">
              Could not load this document.
            </Text>
          ) : (
            <MarkdownContent content={legalDocumentQuery.data?.content ?? ""} />
          )}
        </div>
      )}
    </div>
  );
}

export function PendingAgreementsModal({
  visible,
  pendingLegalDocs,
}: PendingAgreementsModalProps) {
  const [expandedDocType, setExpandedDocType] =
    useState<LegalDocumentType | null>(null);

  const acceptMutation = useAcceptLegalDocuments();

  function toggleSection(docType: LegalDocumentType) {
    setExpandedDocType((current) => (current === docType ? null : docType));
  }

  function handleAccept() {
    const legalDocIds = pendingLegalDocs.map((doc) => doc.id);

    acceptMutation.mutate({ legal_doc_ids: legalDocIds });
  }

  return (
    <Modal
      visible={visible}
      dismissible={false}
      footer={
        <div className="flex flex-col gap-2">
          {acceptMutation.isError && (
            <Text variant="body-sm" className="text-destructive-text">
              Could not accept the documents. Please try again.
            </Text>
          )}

          {acceptMutation.isPending ? (
            <div className="flex items-center justify-center">
              <Spinner size="sm" />
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              title="Accept & Continue"
              onClick={handleAccept}
            />
          )}
        </div>
      }
    >
      <div className="max-h-[400px] overflow-y-auto">
        <Text variant="heading">Updated Terms &amp; Privacy Policy</Text>

        <Text variant="body" className="mt-2 mb-2">
          We have updated our legal documents. Please review and accept to
          continue using Cashevide.
        </Text>

        <ExpandableSection
          title="Terms and Conditions"
          docType="TERMS"
          isExpanded={expandedDocType === "TERMS"}
          onToggle={() => toggleSection("TERMS")}
        />

        <ExpandableSection
          title="Privacy Policy"
          docType="PRIVACY"
          isExpanded={expandedDocType === "PRIVACY"}
          onToggle={() => toggleSection("PRIVACY")}
        />
      </div>
    </Modal>
  );
}

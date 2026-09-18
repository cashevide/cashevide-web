import { useNavigate, useParams } from "react-router";

import { useLegalDocument } from "../hooks/useLegalDocument";
import { useAuthStore } from "../../../stores/authStore";
import { ROUTES } from "../../../lib/routes";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
import { MarkdownContent } from "../components/MarkdownContent";

import type { LegalDocumentNotFoundError } from "../types/legalTypes";

export function LegalDocumentContent() {
  const navigate = useNavigate();
  const { docType } = useParams<{ docType: string }>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const legalDocumentQuery = useLegalDocument(docType ?? "");

  const notFoundError = legalDocumentQuery.error as {
    response?: { data?: LegalDocumentNotFoundError };
  } | null;

  function handleBack() {
    // No history-length check available via React Router the way
    // Expo's router.canGoBack() worked — window.history.length > 1 is
    // the closest web equivalent (1 means this tab opened directly on
    // this page, e.g. a shared link, so there's nothing to go back to).
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(isAuthenticated ? ROUTES.home : ROUTES.welcome, {
      replace: true,
    });
  }

  if (legalDocumentQuery.isLoading) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
        <ScreenHeader
          showBackButton
          onBackPress={handleBack}
          showCreditPoints={false}
        />
        <Container variant="desktop">
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        </Container>
      </div>
    );
  }

  if (legalDocumentQuery.isError) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
        <ScreenHeader
          showBackButton
          onBackPress={handleBack}
          showCreditPoints={false}
        />
        <Container variant="desktop">
          <div className="flex flex-1 flex-col items-center justify-center px-6 gap-6">
            <Text variant="body" className="text-destructive text-center">
              {notFoundError?.response?.data?.detail ??
                "This document could not be found."}
            </Text>
            <Button variant="outline" title="Back" onClick={handleBack} />
          </div>
        </Container>
      </div>
    );
  }

  const document = legalDocumentQuery.data;

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader
        showBackButton
        onBackPress={handleBack}
        showCreditPoints={false}
      />

      <Container variant="desktop" scroll>
        {/* Container is desktop-width (1200px) so the header and this
            page line up, but that's far too wide for comfortable
            reading of dense legal text — max-w-[720px] caps just the
            text column while the outer Container keeps the page's
            standard desktop width. */}
        <div className="w-full max-w-[720px] mx-auto px-6 py-6 flex flex-col gap-1">
          <Text variant="heading">
            {document?.document_type === "TERMS"
              ? "Terms and Conditions"
              : "Privacy Policy"}
          </Text>

          <Text variant="body-sm" className="text-muted-foreground mb-4">
            Version {document?.version} — Effective {document?.effective_date}
          </Text>

          <MarkdownContent content={document?.content ?? ""} />
        </div>
      </Container>
    </div>
  );
}

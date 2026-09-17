import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FileText, IndianRupee } from "lucide-react";

import { useProductDetails } from "../hooks/useProductDetails";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { getFieldErrorMessage } from "../../../lib/api/errors";
import { ROUTES } from "../../../lib/routes";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Spinner } from "../../../components/ui/Spinner";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { InfoDialog } from "../../../components/ui/InfoDialog";
import { InfoListRow } from "../../../components/ui/InfoListRow";

export function ProductDetailsContent() {
  const navigate = useNavigate();
  const { slug: productSlug } = useParams<{ slug: string }>();
  const [limitErrorMessage, setLimitErrorMessage] = useState<string | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const productDetails = useProductDetails(productSlug ?? "");
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

  // Refetch on mount only, matching the established pattern (see
  // InvoiceDetailsContent.tsx for why: no focus-lifecycle event in
  // React Router).
  useEffect(() => {
    if (productSlug) {
      productDetails.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSlug]);

  function handleConfirmDelete() {
    if (!productSlug) return;
    deleteProduct.mutate(productSlug, {
      onSuccess: () => {
        navigate(ROUTES.invoices.products.list, { replace: true });
      },
    });
  }

  function handleArchive() {
    if (!productSlug) return;
    updateProduct.mutate({
      slug: productSlug,
      payload: { is_archived: true },
    });
  }

  function handleUnarchive() {
    if (!productSlug) return;
    updateProduct.mutate(
      { slug: productSlug, payload: { is_archived: false } },
      {
        onError: (error) => {
          setLimitErrorMessage(getFieldErrorMessage(error));
        },
      },
    );
  }

  if (productDetails.isLoading) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
        <ScreenHeader title="Product" showBackButton />
        <Container variant="narrow">
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        </Container>
      </div>
    );
  }

  if (productDetails.isError) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
        <ScreenHeader title="Product" showBackButton />
        <Container variant="narrow">
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <Text variant="body" className="text-muted-foreground">
              Product not found.
            </Text>
            <Button
              variant="outline"
              title="Back to Products"
              onClick={() =>
                navigate(ROUTES.invoices.products.list, { replace: true })
              }
            />
          </div>
        </Container>
      </div>
    );
  }

  const product = productDetails.data;
  const isArchived = product?.is_archived ?? false;

  // Description and unit price are both optional — this finds whichever
  // populated field is actually last, same approach as Business
  // Profile's GST/VAT handling.
  const lastFieldKey = product
    ? (
        [
          ["description", product.description],
          ["unit_price", product.unit_price],
        ] as const
      )
        .filter(([, value]) => !!value)
        .at(-1)?.[0]
    : undefined;

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader title="Product" showBackButton />

      <Container variant="narrow" scroll>
        <div className="flex flex-col gap-6 px-6 py-6">
          <div className="flex flex-col items-center gap-1">
            <Text variant="heading" className="text-center">
              {product?.title}
            </Text>
            {isArchived && <Badge label="Archived" variant="default" />}
          </div>

          <div className="bg-card border border-border rounded-lg px-4">
            <InfoListRow
              icon={FileText}
              label="Description"
              value={product?.description}
              isLast={lastFieldKey === "description"}
            />
            <InfoListRow
              icon={IndianRupee}
              label="Unit Price"
              value={product?.unit_price ? `₹${product.unit_price}` : undefined}
              isLast={lastFieldKey === "unit_price"}
            />
          </div>

          <div className="flex flex-col gap-3">
            {!isArchived && productSlug && (
              <Button
                variant="primary"
                title="Edit Product"
                onClick={() =>
                  navigate(ROUTES.invoices.products.edit(productSlug))
                }
              />
            )}

            {isArchived ? (
              <Button
                variant="outline"
                title="Unarchive Product"
                onClick={handleUnarchive}
                isLoading={updateProduct.isPending}
              />
            ) : (
              <Button
                variant="outline"
                title="Archive Product"
                onClick={handleArchive}
                isLoading={updateProduct.isPending}
              />
            )}

            <Button
              variant="destructive"
              title="Delete Product"
              onClick={() => setShowDeleteConfirm(true)}
            />
          </div>
        </div>
      </Container>

      <ConfirmDialog
        visible={showDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        isConfirming={deleteProduct.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <InfoDialog
        visible={limitErrorMessage !== null}
        title="Cannot Unarchive"
        message={limitErrorMessage ?? ""}
        onDismiss={() => setLimitErrorMessage(null)}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useProductDetails } from "../hooks/useProductDetails";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { getFieldErrorMessage } from "../../../lib/api/errors";
import { ROUTES } from "../../../lib/routes";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";

export function ProductFormContent() {
  const navigate = useNavigate();
  const { slug: productSlug } = useParams<{ slug?: string }>();
  const isEditMode = Boolean(productSlug);

  const productDetails = useProductDetails(productSlug ?? "");
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  useEffect(() => {
    if (isEditMode && productDetails.data) {
      setTitle(productDetails.data.title);
      setDescription(productDetails.data.description);
      setUnitPrice(productDetails.data.unit_price);
    }
  }, [isEditMode, productDetails.data]);

  const mutation = isEditMode ? updateProduct : createProduct;
  const errorMessage = mutation.isError
    ? getFieldErrorMessage(mutation.error)
    : null;

  function handleSave() {
    if (isEditMode && productSlug) {
      updateProduct.mutate(
        {
          slug: productSlug,
          payload: { title, description, unit_price: unitPrice },
        },
        {
          onSuccess: (data) => {
            navigate(ROUTES.invoices.products.detail(data.slug), {
              replace: true,
            });
          },
        },
      );
      return;
    }

    createProduct.mutate(
      { title, description, unit_price: unitPrice },
      {
        onSuccess: (data) => {
          navigate(ROUTES.invoices.products.detail(data.slug), {
            replace: true,
          });
        },
      },
    );
  }

  if (isEditMode && productDetails.isLoading) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
        <ScreenHeader
          title="Edit Product"
          showBackButton
          containerVariant="desktop"
        />
        <Container variant="narrow">
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader
        title={isEditMode ? "Edit Product" : "Add Product"}
        showBackButton
        containerVariant="desktop"
      />

      <Container variant="narrow" scroll>
        <div className="flex flex-col gap-4 px-6 py-6">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            placeholder="Unit Price"
            inputMode="decimal"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
          />

          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
          />

          {errorMessage && (
            <Text variant="body-sm" className="text-center text-destructive">
              {errorMessage}
            </Text>
          )}

          <Button
            variant="primary"
            title={isEditMode ? "Save Changes" : "Create Product"}
            onClick={handleSave}
            disabled={!title.trim() || !unitPrice.trim()}
            isLoading={mutation.isPending}
          />
        </div>
      </Container>
    </div>
  );
}

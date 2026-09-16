import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";

import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { SearchInput } from "../../../components/ui/SearchInput";
import { PillTabs } from "../../../components/ui/PillTabs";
import { Spinner } from "../../../components/ui/Spinner";
import { InfoDialog } from "../../../components/ui/InfoDialog";
import { CreditPointsWidget } from "../../../components/ui/CreditPointsWidget";
import { InvoiceSubTabs } from "../../invoices/components/InvoiceSubTabs";
import { useProducts } from "../hooks/useProducts";
import { useProductUsage } from "../hooks/useProductUsage";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { ROUTES } from "../../../lib/routes";

import type { GetProductsParams } from "../api/productsApi";
import type { Product } from "../types/productTypes";

const ORDERING_OPTIONS: {
  key: NonNullable<GetProductsParams["ordering"]>;
  label: string;
}[] = [
  { key: "-created_at", label: "Newest" },
  { key: "title", label: "Title A-Z" },
];

function SkeletonRow() {
  return (
    <div className="flex flex-col gap-2 border-b border-border py-3">
      <div className="flex flex-row items-center justify-between">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-4 w-16 rounded bg-muted" />
      </div>
      <div className="h-3 w-48 rounded bg-muted" />
    </div>
  );
}

function ProductRow({ product }: { product: Product }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(ROUTES.invoices.products.detail(product.slug))}
      className="flex flex-col gap-1 bg-card border border-border rounded-lg p-4 text-left cursor-pointer transition-colors duration-200 hover:bg-card/80 hover:border-border/60"
    >
      <div className="flex flex-row items-center justify-between gap-2">
        <Text variant="body-lg" className="flex-1 font-semibold truncate">
          {product.title}
        </Text>
        <Text variant="body-sm" className="font-semibold">
          ₹{product.unit_price}
        </Text>
      </div>

      {!!product.description && (
        <Text variant="body-sm" className="text-muted-foreground truncate">
          {product.description}
        </Text>
      )}
    </button>
  );
}

export function InvoiceProductsContent() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [ordering, setOrdering] =
    useState<GetProductsParams["ordering"]>("-created_at");
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  // Sentinel for scroll-triggered infinite loading — see
  // InvoiceListContent.tsx for why this replaces FlatList's
  // onEndReached on the web (IntersectionObserver instead).
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const products = useProducts({
    search: debouncedSearchText || undefined,
    ordering,
  });
  const productUsage = useProductUsage();

  // Refetch on mount only, matching InvoiceListContent's pattern (see
  // that file for why: no focus-lifecycle event in React Router).
  useEffect(() => {
    products.refetch();
    productUsage.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = products;

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allProducts: Product[] =
    products.data?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = products.data?.pages[0]?.count ?? 0;

  const isUsageLimitReached =
    productUsage.data?.max_allowed_product != null &&
    productUsage.data.current_product_count >=
      productUsage.data.max_allowed_product;

  function handleAddProductPress() {
    if (isUsageLimitReached) {
      setShowLimitDialog(true);
      return;
    }
    navigate(ROUTES.invoices.products.create);
  }

  const searchActive = debouncedSearchText.length > 0;

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader containerVariant="desktop">
        <div className="flex flex-row items-center justify-between">
          <Text variant="heading">Products</Text>

          <CreditPointsWidget />
        </div>
      </ScreenHeader>

      {/* Fixed block: sub-tabs, search, sort tabs, archived link — see
          InvoiceListContent.tsx for why this sits outside Container's
          scroll area. */}
      <div className="w-full mx-auto max-w-desktop px-6 pt-6 pb-4 flex flex-col gap-4">
        <InvoiceSubTabs />

        <SearchInput
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onClear={() => setSearchText("")}
          placeholder="Search by title"
        />

        <div className="flex flex-row items-center justify-between gap-2">
          <PillTabs
            items={ORDERING_OPTIONS}
            activeKey={ordering ?? ORDERING_OPTIONS[0].key}
            onSelect={(key) =>
              setOrdering(key as GetProductsParams["ordering"])
            }
            layout="segmented"
          />

          {/* Sized to match PillTabs' segmented track exactly — see
              InvoiceListContent.tsx for the h-9/rounded-md math. */}
          <Button
            variant="brand"
            shape="md"
            className="h-9 min-w-0 shrink-0 px-3.5 rounded-md"
            title="New Product"
            leftIcon={<Plus size={14} />}
            onClick={handleAddProductPress}
          />
        </div>

        <div className="flex flex-row items-center justify-between">
          {!products.isLoading && allProducts.length > 0 ? (
            <Text variant="caption" className="pl-1">
              {totalCount} {totalCount === 1 ? "product" : "products"}
            </Text>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={() => navigate(ROUTES.invoices.products.archived)}
            className="cursor-pointer"
          >
            <Text variant="body-sm" className="text-link">
              Archived
            </Text>
          </button>
        </div>
      </div>

      <Container variant="desktop" scroll>
        <div className="flex flex-1 flex-col gap-3 px-6 py-6">
          {products.isLoading ? (
            <div>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : allProducts.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-1">
              <Text variant="body-lg" className="font-semibold">
                {searchActive ? "No matching products" : "No products yet"}
              </Text>
              <Text
                variant="body-sm"
                className="text-muted-foreground text-center max-w-[280px]"
              >
                {searchActive
                  ? "Try a different search term."
                  : "Add your first product to get started."}
              </Text>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {allProducts.map((product) => (
                <ProductRow key={product.slug} product={product} />
              ))}

              {products.hasNextPage && (
                <div
                  ref={loadMoreRef}
                  className="flex items-center justify-center py-4"
                >
                  {products.isFetchingNextPage ? <Spinner size="sm" /> : null}
                </div>
              )}
            </div>
          )}
        </div>
      </Container>

      <InfoDialog
        visible={showLimitDialog}
        title="Product Limit Reached"
        message={`You cannot add more than ${productUsage.data?.max_allowed_product} products in your current plan.`}
        onDismiss={() => setShowLimitDialog(false)}
      />
    </div>
  );
}

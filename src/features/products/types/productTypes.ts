import type { PaginatedResponse } from "../../../types/paginationTypes";

// Generic DRF field-error shape — same pattern as other typed files.
type FieldErrors<T extends string> = Partial<Record<T, string[]>>;

// -------------------- shared shape --------------------
export type Product = {
  id: number;
  user: number;
  title: string;
  description: string;
  unit_price: string;
  slug: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  is_active: boolean;
};

// -------------------- list --------------------
// GET /products/?is_archived=true|false
export type ProductsListResponse = PaginatedResponse<Product>;

// -------------------- create --------------------
// POST /products/
export type CreateProductRequest = {
  title: string;
  description?: string;
  unit_price: string;
};

export type CreateProductResponse = Product;

// Tier-limit error comes back as a plain string array, not field-keyed
// e.g. ["You cannot create more than 2 products in COMMUNITY plan"]
export type CreateProductTierLimitError = string[];

export type CreateProductErrorField = "title" | "description" | "unit_price";
export type CreateProductFieldError = FieldErrors<CreateProductErrorField>;

export type CreateProductError =
  | CreateProductFieldError
  | CreateProductTierLimitError;

// -------------------- detail --------------------
// GET /products/{slug}/
export type ProductDetailResponse = Product;

export type ProductNotFoundError = {
  detail: string;
};

// -------------------- update (also used for archive/unarchive) --------------------
// PATCH /products/{slug}/
export type UpdateProductRequest = {
  title?: string;
  description?: string;
  unit_price?: string;
  is_active?: boolean;
  is_archived?: boolean;
};

export type UpdateProductResponse = Product;

// Unarchive tier-limit error is field-keyed under is_archived
// e.g. { is_archived: ["You cannot unarchive more than 2 products in COMMUNITY plan"] }
export type UpdateProductErrorField = CreateProductErrorField | "is_archived";
export type UpdateProductError = FieldErrors<UpdateProductErrorField>;

// -------------------- usage --------------------
// GET /products/usage/
export type ProductUsageResponse = {
  current_product_count: number;
  max_allowed_product: number | null;
};

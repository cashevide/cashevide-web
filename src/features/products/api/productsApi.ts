import { api } from "../../../lib/api-client";
import { PRODUCT_ENDPOINTS } from "../../../lib/api/endpoints";

import type {
  ProductsListResponse,
  CreateProductRequest,
  CreateProductResponse,
  ProductDetailResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  ProductUsageResponse,
} from "../types/productTypes";

export type GetProductsParams = {
  search?: string;
  ordering?: "title" | "-title" | "created_at" | "-created_at";
  is_archived?: boolean;
  page?: number;
};

export async function getProductsApi(
  params?: GetProductsParams,
): Promise<ProductsListResponse> {
  const response = await api.get<ProductsListResponse>(PRODUCT_ENDPOINTS.list, {
    params,
  });
  return response.data;
}

export async function createProductApi(
  payload: CreateProductRequest,
): Promise<CreateProductResponse> {
  const response = await api.post<CreateProductResponse>(
    PRODUCT_ENDPOINTS.create,
    payload,
  );
  return response.data;
}

export async function getProductDetailApi(
  slug: string,
): Promise<ProductDetailResponse> {
  const response = await api.get<ProductDetailResponse>(
    PRODUCT_ENDPOINTS.detail(slug),
  );
  return response.data;
}

export async function updateProductApi(
  slug: string,
  payload: UpdateProductRequest,
): Promise<UpdateProductResponse> {
  const response = await api.patch<UpdateProductResponse>(
    PRODUCT_ENDPOINTS.detail(slug),
    payload,
  );
  return response.data;
}

export async function deleteProductApi(slug: string): Promise<void> {
  await api.delete(PRODUCT_ENDPOINTS.detail(slug));
}

export async function getProductUsageApi(): Promise<ProductUsageResponse> {
  const response = await api.get<ProductUsageResponse>(PRODUCT_ENDPOINTS.usage);
  return response.data;
}

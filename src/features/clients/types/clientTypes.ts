import type { PaginatedResponse } from "../../../types/paginationTypes";

// Generic DRF field-error shape — same pattern as other typed files.
type FieldErrors<T extends string> = Partial<Record<T, string[]>>;

// -------------------- shared shape --------------------
export type Client = {
  id: number;
  user: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  slug: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  is_active: boolean;
};

// -------------------- list --------------------
// GET /clients/?is_archived=true|false
export type ClientsListResponse = PaginatedResponse<Client>;

// -------------------- create --------------------
// POST /clients/
export type CreateClientRequest = {
  name: string;
  email?: string;
  phone: string;
  address?: string;
};

export type CreateClientResponse = Client;

// Tier-limit error comes back as a plain string array, not field-keyed
// e.g. ["You cannot create more than 2 clients in COMMUNITY plan"]
export type CreateClientTierLimitError = string[];

export type CreateClientErrorField = "name" | "email" | "phone" | "address";
export type CreateClientFieldError = FieldErrors<CreateClientErrorField>;

export type CreateClientError =
  | CreateClientFieldError
  | CreateClientTierLimitError;

// -------------------- detail --------------------
// GET /clients/{slug}/
export type ClientDetailResponse = Client;

export type ClientNotFoundError = {
  detail: string;
};

// -------------------- update (also used for archive/unarchive) --------------------
// PATCH /clients/{slug}/
export type UpdateClientRequest = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  is_active?: boolean;
  is_archived?: boolean;
};

export type UpdateClientResponse = Client;

// Unarchive tier-limit error is field-keyed under is_archived
// e.g. { is_archived: ["You cannot unarchive more than 2 clients in COMMUNITY plan"] }
export type UpdateClientErrorField = CreateClientErrorField | "is_archived";
export type UpdateClientError = FieldErrors<UpdateClientErrorField>;

// -------------------- usage --------------------
// GET /clients/usage/
export type ClientUsageResponse = {
  current_client_count: number;
  max_allowed_client: number | null;
};

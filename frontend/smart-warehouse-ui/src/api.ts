import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5127/api"
});

export interface Product {
  id: number;
  companyId: string;
  productCode: string;
  productName: string;
  description?: string;
  unit?: string;
}

export interface PagedResponse<T> {
  success: boolean;
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Location {
  id: number;
  companyId: string;
  locationCode: string;
  locationName: string;
  zone?: string;
  priority?: number;
}

export type StockMovementType = "in" | "out";

export interface StockMovement {
  id: number;
  companyId: string;
  productId: number;
  warehouseLocationId: number;
  movementType: number;
  quantity: number;
  referenceNo?: string;
  note?: string;
  movementAtUtc: string;
}

const toCamel = <T>(obj: any): T => {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((x) => toCamel(x)) as any;
  const result: any = {};
  Object.keys(obj).forEach((key) => {
    const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
    result[camelKey] = toCamel(obj[key]);
  });
  return result;
};

export async function fetchProductsPaged(params: {
  companyId: string;
  page: number;
  pageSize: number;
  search?: string;
}): Promise<PagedResponse<Product>> {
  const body = {
    CompanyId: params.companyId,
    Page: params.page,
    PageSize: params.pageSize,
    Search: params.search ?? null
  };
  const res = await api.post("/products/paged", body);
  return toCamel<PagedResponse<Product>>(res.data);
}

export async function createProduct(input: {
  companyId: string;
  productCode: string;
  productName: string;
  description?: string;
  unit?: string;
}) {
  const body = {
    CompanyId: input.companyId,
    ProductCode: input.productCode,
    ProductName: input.productName,
    Description: input.description ?? null,
    Unit: input.unit ?? null
  };
  const res = await api.post("/products/create", body);
  return toCamel<{ success: boolean; data: Product }>(res.data);
}

export async function updateProduct(input: {
  companyId: string;
  id: number;
  productName: string;
  description?: string;
  unit?: string;
}) {
  const body = {
    CompanyId: input.companyId,
    Id: input.id,
    ProductName: input.productName,
    Description: input.description ?? null,
    Unit: input.unit ?? null
  };
  const res = await api.post("/products/update", body);
  return toCamel<{ success: boolean; data: Product }>(res.data);
}

export async function deleteProduct(input: { companyId: string; id: number }) {
  const body = {
    CompanyId: input.companyId,
    Id: input.id
  };
  const res = await api.post("/products/delete", body);
  return toCamel<{ success: boolean }>(res.data);
}

export async function fetchLocationsPaged(params: {
  companyId: string;
  page: number;
  pageSize: number;
  search?: string;
}): Promise<PagedResponse<Location>> {
  const body = {
    CompanyId: params.companyId,
    Page: params.page,
    PageSize: params.pageSize,
    Search: params.search ?? null
  };
  const res = await api.post("/locations/paged", body);
  return toCamel<PagedResponse<Location>>(res.data);
}

export async function createLocation(input: {
  companyId: string;
  locationCode: string;
  locationName: string;
  zone?: string;
  priority?: number;
}) {
  const body = {
    CompanyId: input.companyId,
    LocationCode: input.locationCode,
    LocationName: input.locationName,
    Zone: input.zone ?? null,
    Priority: input.priority ?? null
  };
  const res = await api.post("/locations/create", body);
  return toCamel<{ success: boolean; data: Location }>(res.data);
}

export async function fetchStockMovementsPaged(params: {
  companyId: string;
  page: number;
  pageSize: number;
  productId?: number;
  warehouseLocationId?: number;
}): Promise<PagedResponse<StockMovement>> {
  const body = {
    CompanyId: params.companyId,
    Page: params.page,
    PageSize: params.pageSize,
    ProductId: params.productId ?? null,
    WarehouseLocationId: params.warehouseLocationId ?? null
  };
  const res = await api.post("/stock-movements/paged", body);
  return toCamel<PagedResponse<StockMovement>>(res.data);
}

export async function createStockMovement(input: {
  companyId: string;
  productId: number;
  warehouseLocationId: number;
  movementType: 1 | 2;
  quantity: number;
  referenceNo?: string;
  note?: string;
}) {
  const body = {
    CompanyId: input.companyId,
    ProductId: input.productId,
    WarehouseLocationId: input.warehouseLocationId,
    MovementType: input.movementType,
    Quantity: input.quantity,
    ReferenceNo: input.referenceNo ?? null,
    Note: input.note ?? null
  };
  const res = await api.post("/stock-movements/create", body);
  return toCamel<{ success: boolean; data: StockMovement }>(res.data);
}


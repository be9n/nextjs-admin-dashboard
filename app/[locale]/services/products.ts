import { serialize } from "object-to-formdata";
import authAxios from "../lib/authAxios";
import { Image, Pagination, SuccessApiResponse } from "../types/global";
import { routing } from "@/i18n/routing";
import { ProductFormValues } from "../dashboard/products/schemas/productSchema";

type ProductsQueryParams = {
  search?: string;
  page?: string;
  category_id?: string;
  sort_by?: string;
  sort_dir?: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  category_name: string;
};

export type PaginatedProducts = {
  data: Product[];
  pagination: Pagination;
};

// Create a localized name type based on available locales
export type LocalizedString = {
  [key in (typeof routing.locales)[number]]: string;
};

export const getProducts = async (
  params?: ProductsQueryParams
): Promise<PaginatedProducts | null> => {
  const queryString = new URLSearchParams(params).toString();
  const { data: response } = await authAxios.get(`/products?${queryString}`);

  return response.data.products;
};

export type EditProduct = {
  id: number;
  name: LocalizedString;
  description?: LocalizedString;
  price: number;
  category_id: number;
  parent_category_id: number;
  images: Image[];
};

export const getProduct = async (
  productId: string
): Promise<EditProduct | null> => {
  const { data: response } = await authAxios.get(`/products/${productId}`);

  return response.data.product;
};

export const createProduct = async ({
  data,
}: {
  data: ProductFormValues;
}): Promise<SuccessApiResponse> => {
  const formData = serialize(data);
  const { data: response } = await authAxios.post("/products", formData);

  return response;
};

export const updateProduct = async ({
  data,
  productId,
}: {
  data: ProductFormValues;
  productId: number;
}): Promise<SuccessApiResponse> => {
  const formData = serialize(data);

  formData.append("_method", "PUT");

  const { data: response } = await authAxios.post(
    `/products/${productId}`,
    formData
  );

  return response;
};

export const deleteProduct = async (
  productId: number
): Promise<SuccessApiResponse> => {
  const { data: response } = await authAxios.delete(`/products/${productId}`);

  return response;
};

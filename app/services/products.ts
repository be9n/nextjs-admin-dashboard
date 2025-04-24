import { serialize } from "object-to-formdata";
import { ProductFormValues } from "../dashboard/products/components/ProductForm";
import authAxios from "../lib/authAxios";
import { Pagination, SuccessApiResponse } from "../types/global";

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

export const getProducts = async (
  params?: ProductsQueryParams
): Promise<PaginatedProducts | null> => {
  const queryString = new URLSearchParams(params).toString();
  const { data: response } = await authAxios.get(`/products?${queryString}`);

  return response.data.products;
};

export type EditProduct = {
  id: number;
  name: string;
  price: number;
  category_id: number;
  parent_category_id: number;
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

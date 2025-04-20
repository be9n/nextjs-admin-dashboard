import authAxios from "../lib/authAxios";
import { Pagination } from "../types/global";

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
  params?: Record<string, string>
): Promise<PaginatedProducts | null> => {
  const queryString = new URLSearchParams(params).toString();
  const { data: response } = await authAxios.get(`/products?${queryString}`);

  return response.data.products;
};

export const deleteProduct = async (productId: number) => {
  const { data: response } = await authAxios.delete(`/products/${productId}`);

  return response;
};

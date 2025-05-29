import { serialize } from "object-to-formdata";
import authAxios from "../lib/authAxios";
import {
  SuccessApiResponse,
  QueryParams,
} from "../types/global";
import { ProductFormValues } from "../schemas/productSchema";
import { EditProduct, PaginatedProducts } from "@/types/products";


export const getProducts = async (
  params?: QueryParams
): Promise<PaginatedProducts | null> => {
  const { data: response } = await authAxios.get(`/products`, {
    params,
  });

  return response.data.products;
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

export const updateProductActive = async ({
  productId,
  active,
}: {
  productId: number;
  active: boolean;
}): Promise<SuccessApiResponse> => {
  const { data: response } = await authAxios.post(
    `/products/${productId}/change_active`,
    { active }
  );

  return response;
};

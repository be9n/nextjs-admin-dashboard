import { serialize } from "object-to-formdata";
import { CategoryFormValues } from "../schemas/categorySchema";
import authAxios from "../lib/authAxios";
import {
  IntBoolean,
  Pagination,
  SuccessApiResponse,
  QueryParams,
} from "../types/global";
import { Category, CategoryListItem, EditCategory } from "../types/categories";

export type PaginatedCategories = {
  data: Category[];
  pagination: Pagination;
};

export const getCategories = async (
  params?: QueryParams
): Promise<PaginatedCategories | null> => {
  const { data: response } = await authAxios.get(`/categories`, {
    params,
  });

  return response.data.categories;
};

export const getCategory = async (
  categoryId: string
): Promise<EditCategory | null> => {
  const { data: response } = await authAxios.get(`/categories/${categoryId}`);

  return response.data.category;
};

export const getCategoriesList = async ({
  parentCategories = 0,
  withChildren = 0,
}: {
  parentCategories?: IntBoolean;
  withChildren?: IntBoolean;
} = {}): Promise<CategoryListItem[] | null> => {
  const { data: response } = await authAxios.get(`/categories/list`, {
    params: {
      parent: parentCategories,
      with_children: withChildren,
    },
  });

  return response.data.categories;
};

export const createCategory = async ({
  data,
}: {
  data: CategoryFormValues;
}): Promise<SuccessApiResponse> => {
  const formData = serialize(data);
  const { data: response } = await authAxios.post("/categories", formData);

  return response;
};

export const updateCategory = async ({
  data,
  categoryId,
}: {
  data: CategoryFormValues;
  categoryId: number;
}): Promise<SuccessApiResponse> => {
  const formData = serialize(data);

  formData.append("_method", "PUT");

  const { data: response } = await authAxios.post(
    `/categories/${categoryId}`,
    formData
  );

  return response;
};

export const deleteCategory = async (
  categoryId: number
): Promise<SuccessApiResponse> => {
  const { data: response } = await authAxios.delete(
    `/categories/${categoryId}`
  );

  return response;
};

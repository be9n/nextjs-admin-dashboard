import authAxios from "../lib/authAxios";

export type CategoryListItem = {
  id: number;
  name: string;
};

export const getCategoriesList = async (): Promise<CategoryListItem[] | null> => {
  const { data: response } = await authAxios.get(`/categories_list`);

  return response.data.categories;
};

import authAxios from "../lib/authAxios";
import { IntBoolean } from "../types/global";

export type CategoryListItem = {
  id: number;
  name: string;
  children?: CategoryListItem[];
};

export const getCategoriesList = async ({
  parentCategories = 0,
  withChildren = 0,
}: {
  parentCategories?: IntBoolean;
  withChildren?: IntBoolean;
} = {}): Promise<CategoryListItem[] | null> => {
  const { data: response } = await authAxios.get(
    `/categories_list?parent=${parentCategories}&with_children=${withChildren}`
  );

  return response.data.categories;
};

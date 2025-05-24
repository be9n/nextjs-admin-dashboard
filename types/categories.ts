import { LocalizedString } from "../services/products";
import { Image } from "./global";

export type Category = {
  id: number;
  name: string;
  parent_category_name: string;
  products_count: number;
};

export type CategoryListItem = {
  id: number;
  name: string;
  children?: CategoryListItem[];
};

export type EditCategory = {
  id: number;
  name: LocalizedString;
  parent_id: number;
  image: Image;
};

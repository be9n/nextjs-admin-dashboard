import { LocalizedString, Pagination, Image } from "./global";

export type PaginatedProducts = {
  data: Product[];
  pagination: Pagination;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  category_name: string;
  active: boolean;
};

export type EditProduct = {
  id: number;
  name: LocalizedString;
  description?: LocalizedString;
  price: number;
  category_id: number;
  parent_category_id: number;
  active: boolean;
  images: Image[];
};
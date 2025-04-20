import authAxios from "../lib/authAxios";
import { Pagination } from "../types/global";

export type Role = {
  id: number;
  title: string;
  permissions_count: number;
};

export type PaginatedRoles = {
  data: Role[];
  pagination: Pagination;
};

export const getRoles = async (
  params?: Record<string, string>
): Promise<PaginatedRoles | null> => {
  const queryString = new URLSearchParams(params).toString();
  const { data: response } = await authAxios.get(`/roles?${queryString}`);

  return response.data.roles;
};

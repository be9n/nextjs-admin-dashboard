"use server";

import authAxios from "@/app/lib/authAxios";
import { Role } from "@/app/services/roles";
import { Pagination } from "@/app/types/global";

export type PaginatedRoles = {
  data: Role[];
  pagination: Pagination;
};

export const getRoles = async (page = 1): Promise<PaginatedRoles> => {
  const { data: response } = await authAxios.get(`/roles?page=${page}`);

  return response.data.roles;
};

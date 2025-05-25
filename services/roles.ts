import { notFound } from "next/navigation";
import { RoleFormValues } from "../app/[locale]/dashboard/roles/components/RoleForm";
import authAxios from "../lib/authAxios";
import { ApiError, Pagination, SuccessApiResponse, QueryParams } from "../types/global";
import { serialize } from "object-to-formdata";

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
  params?: QueryParams
): Promise<PaginatedRoles | null> => {
  const { data: response } = await authAxios.get(`/roles`, {
    params,
  });

  return response.data.roles;
};

export type EditRole = {
  id: number;
  title: string;
  permissions_list: string[];
};

export const getRole = async (roleId: string): Promise<EditRole> => {
  try {
    const { data: response } = await authAxios.get(`/roles/${roleId}`);
    return response.data.role;
  } catch (error) {
    const apiError = error as ApiError;
    if (apiError.code === 404) {
      notFound();
    }

    throw error;
  }
};

export const createRole = async ({
  data,
}: {
  data: RoleFormValues;
}): Promise<SuccessApiResponse> => {
  const formData = serialize(data);
  const { data: response } = await authAxios.post("roles", formData);

  return response;
};

export const updateRole = async ({
  data,
  roleId,
}: {
  data: RoleFormValues;
  roleId: number;
}): Promise<SuccessApiResponse> => {
  const formData = serialize(data);
  formData.append("_method", "PUT");
  const { data: response } = await authAxios.post(`roles/${roleId}`, formData);

  return response;
};

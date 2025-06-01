import authAxios from "../lib/authAxios";
import { PermissionNode } from "../types/global";

export const getPermissionsList = async (): Promise<
  PermissionNode[] | null
> => {
  const { data: response } = await authAxios.get("/permissions/list");

  return response.data.permissions_list;
};

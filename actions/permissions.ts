"use server";

import { cookies } from "next/headers";

export const getPermissions = async () => {
  const permissions = (await cookies()).get("permissions");
  return permissions;
};

export const setPermissions = async (permissions: string[]) => {
  (await cookies()).set("permissions", JSON.stringify(permissions));
};

export const removePermissions = async () => {
  (await cookies()).delete("permissions");
};

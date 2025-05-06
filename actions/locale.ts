"use server";

import { cookies } from "next/headers";

export const getCurrentLocale = async () => {
  const locale = (await cookies()).get("NEXT_LOCALE")?.value;
  return locale;
};

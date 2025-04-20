"use server";

import { cookies } from "next/headers";

export const getAccessToken = async () => {
  const accessToken = (await cookies()).get("access_token")?.value;
  return accessToken;
};

export const setAccessTokenCookie = async (accessToken: string) => {
  const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  (await cookies()).set("access_token", accessToken, {
    expires: expiredAt,
    httpOnly: false,
    secure: true,
    path: "/",
    sameSite: "lax",
  });
};

export const removeAccessToken = async () => {
  (await cookies()).delete("access_token");
};

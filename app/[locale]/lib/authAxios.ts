import { getAccessToken } from "@/actions/auth";
import axios from "axios";
import { redirect } from "next/navigation";
import { ApiError } from "../types/global";
import { getCurrentLocale } from "@/actions/locale";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const authAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

authAxios.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    const locale = await getCurrentLocale();

    config.headers.Authorization = `Bearer ${accessToken}`;
    config.headers.Locale = locale;

    return config;
  },
  (error) => Promise.reject(error)
);

authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status == 401 || error.response?.status == 403) {
      if (typeof window !== "undefined") {
        window.location.href = "/logout";
      } else {
        redirect("/logout");
      }
    }

    const data = error.response?.data;

    if (data) {
      const apiError: ApiError = data;

      return Promise.reject(apiError);
    }

    return Promise.reject(error);
  }
);

export default authAxios;

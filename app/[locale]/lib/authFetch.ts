import { getAccessToken } from "@/actions/auth";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Custom fetch wrapper that handles authentication and error responses
 * @param url - The URL to fetch from (will be appended to API_URL)
 * @param options - Fetch options
 * @returns Promise with the fetch response
 */
async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get the access token
  const accessToken = await getAccessToken();

  // Prepare headers with authorization
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  // Create fetch options with credentials and headers
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Equivalent to withCredentials: true in axios
  };

  // Make the fetch request
  const response = await fetch(`${API_URL}${url}`, fetchOptions);
  const data = await response.json();
  // Handle 401 Unauthorized responses
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/logout";
    } else {
      redirect("/logout");
    }
    // This will not be reached due to the redirect, but TypeScript needs it
    throw new Error("Unauthorized");
  }

  if (response.status !== 200) {
    throw new Error(data);
  }

  return data;
}

export default authFetch;

import { NextIntlClientProvider } from "next-intl";

/**
 * Internationalization provider component
 * 
 * IMPORTANT: This is intentionally NOT marked with 'use client'
 * --------------------------------------------------------------
 * This allows it to be rendered as a Server Component where possible.
 * NextIntlClientProvider will internally add client boundaries where needed,
 * but the initial setup can be done on the server for better performance.
 * 
 * By keeping this as a server component, we:
 * 1. Reduce client-side JavaScript bundle size
 * 2. Enable initial translation data to be included in the server response
 * 3. Improve initial load performance
 */
export function IntlProvider({ children }: { children: React.ReactNode }) {
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
} 
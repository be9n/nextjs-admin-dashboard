"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { DirectionProvider } from "@radix-ui/react-direction";
import { useParams } from "next/navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
  const { locale } = useParams();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: false,
      },
    },
  });

  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <QueryClientProvider client={queryClient}>
      <DirectionProvider dir={dir}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </DirectionProvider>
    </QueryClientProvider>
  );
}

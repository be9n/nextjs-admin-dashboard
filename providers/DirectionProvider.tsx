"use client";

import { useParams } from "next/navigation";
import { DirectionProvider as RadixDirectionProvider } from "@radix-ui/react-direction";

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useParams();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return <RadixDirectionProvider dir={dir}>{children}</RadixDirectionProvider>;
} 
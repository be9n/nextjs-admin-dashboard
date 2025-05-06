"use client"

import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { routing } from "@/i18n/routing";

export default function LocaleSwapper() {
  const router = useRouter();
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <div>
      <Select
        defaultValue={locale as string}
        onValueChange={(value) => {
          // Preserve search params when switching locales
          const params = searchParams.toString();
          const targetPath = params ? `${pathname}?${params}` : pathname;
          router.replace(targetPath, { locale: value });
        }}
      >
        <SelectTrigger size="sm"  className="cursor-pointer">
          <SelectValue placeholder="Select A Locale" />
        </SelectTrigger>
        <SelectContent className="start-0">
          {routing.locales.map((locale) => (
            <SelectItem className="cursor-pointer" key={locale} value={locale}>
              {locale.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

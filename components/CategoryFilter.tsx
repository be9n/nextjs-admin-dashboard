"use client";

import { CategoryListItem, getCategoriesList } from "@/app/[locale]/services/categories";
import { ApiError } from "@/app/[locale]/types/global"; 
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { parseAsInteger, useQueryState } from "nuqs";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

export default function CategoryFilter() {
  const { data: categoriesList, isLoading } = useQuery<
    CategoryListItem[] | null,
    ApiError
  >({
    queryKey: ["categories_list"],
    queryFn: async () =>
      getCategoriesList({ parentCategories: 0, withChildren: 0 }),
    staleTime: 60 * 1000, // 1 minute stale time
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
  });
  const [categoryId, setCategoryId] = useQueryState("category_id");
  const [, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const onSelect = (value: string) => {
    setCategoryId(value === "all" ? null : value);
    setPage(1);
  };

  return (
    <Select defaultValue={categoryId || "all"} onValueChange={onSelect}>
      <SelectTrigger className="w-[180px] cursor-pointer">
        {categoryId && isLoading ? (
          <Skeleton className="w-25 h-4" />
        ) : (
          <SelectValue placeholder="Select A Category" />
        )}
      </SelectTrigger>
      <SelectContent className="w-50">
        <SelectItem className="cursor-pointer" key="clear" value="all">
          All Categories
        </SelectItem>
        {isLoading ? (
          <div className="space-y-2 mt-3">
            <Skeleton className="h-7 w-full bg-gray-200" />
            <Skeleton className="h-7 w-full bg-gray-200" />
            <Skeleton className="h-7 w-full bg-gray-200" />
          </div>
        ) : (
          <>
            <div className="space-y-1">
              {(categoriesList || []).map((item) => (
                <SelectItem
                  className={cn("cursor-pointer w-full", {
                    "bg-gray-100": item.id.toString() === categoryId,
                  })}
                  key={item.id}
                  value={item.id.toString()}
                >
                  {item.name}
                </SelectItem>
              ))}
            </div>
          </>
        )}
      </SelectContent>
    </Select>
  );
}

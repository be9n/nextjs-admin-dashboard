"use client";

import { getCategoriesList } from "@/services/categories";
import { ApiError } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { CategoryListItem } from "@/types/categories";
import useFilters from "@/hooks/useFilters";

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

  const { filters, updateFilter } = useFilters();

  const onSelect = (value: string) => {
    updateFilter("category_id", value === "all" ? undefined : value);
  };

  return (
    <Select
      defaultValue={filters.category_id || "all"}
      onValueChange={onSelect}
    >
      <SelectTrigger className="w-[180px] cursor-pointer">
        {filters.category_id && isLoading ? (
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
                    "bg-gray-100": item.id.toString() === filters.category_id,
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

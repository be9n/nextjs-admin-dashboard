"use client";

import React, { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { ApiError } from "@/app/types/global";
import { toast } from "sonner";
import DataTable from "./data-table/DataTable";
import { getProducts, PaginatedProducts } from "@/app/services/products";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  const queryParams = {
    page: searchParams.get("page") || "",
    sort_by: searchParams.get("sort_by") || "",
    sort_dir: searchParams.get("sort_dir") || "",
    search: searchParams.get("search") || "",
    category_id: searchParams.get("category_id") || "",
  };

  const {
    data: products,
    isLoading,
    isFetching,
    error,
    isError,
  } = useQuery<PaginatedProducts | null, ApiError>({
    queryKey: ["products", queryParams],
    queryFn: async () => getProducts(queryParams),
    staleTime: 60 * 1000, // 1 minute stale time
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    placeholderData: keepPreviousData,
  });

  if (isError) {
    toast.error(error.message);
  }

  return (
    <div className="mx-auto">
      <div className="flex items-center">
        <h2 className="font-bold text-lg md:text-2xl">Products</h2>
        <Button className="ms-auto" asChild>
          <Link href={"/dashboard/products/create"}>Create Product</Link>
        </Button>
      </div>

      <DataTable
        data={products?.data}
        pagination={products?.pagination}
        isLoading={isLoading}
        isFetching={isFetching}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        selectedProductIds={selectedProductIds}
        setSelectedProductIds={setSelectedProductIds}
      />
    </div>
  );
}

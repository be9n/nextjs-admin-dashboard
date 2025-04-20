"use client";

import React, { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import DataTable from "./DataTable";
import { getRoles, PaginatedRoles } from "@/app/services/roles";
import { ApiError } from "@/app/types/global";
import { toast } from "sonner";

export default function RolesPage() {
  const searchParams = useSearchParams();
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  const queryParams = {
    page: searchParams.get("page") || "",
    sort_by: searchParams.get("sort_by") || "",
    sort_dir: searchParams.get("sort_dir") || "",
    search: searchParams.get("search") || "",
  };

  const {
    data: roles,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery<PaginatedRoles | null, ApiError>({
    queryKey: ["roles", queryParams],
    queryFn: async () => getRoles(queryParams),
    staleTime: 60 * 1000, // 1 minute stale time
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    placeholderData: keepPreviousData,
  });

  if (isError) {
    toast.error(error.message);
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable
        data={roles?.data}
        pagination={roles?.pagination}
        isLoading={isLoading}
        isFetching={isFetching}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        selectedRoleIds={selectedRoleIds}
        setSelectedRoleIds={setSelectedRoleIds}
      />
    </div>
  );
}

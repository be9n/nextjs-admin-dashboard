"use client";

import React, { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import DataTable from "./data-table/DataTable";
import { getRoles, PaginatedRoles } from "@/app/services/roles";
import { ApiError } from "@/app/types/global";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useErrorNotification } from "@/hooks/useErrorNotification";

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
    staleTime: 0,
    gcTime: 0,
    placeholderData: keepPreviousData,
  });

  useErrorNotification({
    isError,
    title: "Something went wrong",
    description: error?.message || "",
  });

  return (
    <div className="container mx-auto py-8 px-3 lg:px-4">
      <div className="flex items-center">
        <h2 className="font-bold text-lg md:text-2xl">Roles</h2>
        <Button className="ms-auto" asChild>
          <Link href={"/dashboard/roles/create"}>Create Role</Link>
        </Button>
      </div>

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

"use client";

import React, { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import DataTable from "./data-table/DataTable";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { ApiError } from "../../types/global";
import { getRoles, PaginatedRoles } from "../../services/roles";

export default function RolesPage() {
  const t = useTranslations("RolesPage");
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
        <h2 className="font-bold text-lg md:text-2xl">{t("title")}</h2>
        <Button className="ms-auto" asChild>
          <Link href={"/dashboard/roles/create"}>{t("createRole")}</Link>
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

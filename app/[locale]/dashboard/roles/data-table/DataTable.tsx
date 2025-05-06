"use client";

import CustomPagination from "@/components/CustomPagination";
import { Pagination } from "@/app/[locale]/types/global";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchBox from "@/components/SearchBox";
import ColumnVisibilityMenu from "@/components/ColumnVisibilityMenu";
import { useColumns } from "./Columns";
import { Role } from "@/app/[locale]/services/roles";
import { useTranslations } from "next-intl";

interface DataTableProps {
  data?: Role[];
  pagination?: Pagination;
  isLoading?: boolean;
  isFetching?: boolean;
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
  visibleColumns: string[];
  setSelectedRoleIds: React.Dispatch<React.SetStateAction<number[]>>;
  selectedRoleIds: number[];
}

export default function DataTable({
  data,
  pagination,
  isLoading = false,
  isFetching = false,
  setVisibleColumns,
  visibleColumns,
  setSelectedRoleIds,
  selectedRoleIds,
}: DataTableProps) {
  const t = useTranslations("RolesPage");
  const tGlobal = useTranslations("global");
  const allRoleIds = data?.map((role) => role.id);
  const columns = useColumns(selectedRoleIds, setSelectedRoleIds, allRoleIds);

  return (
    <div>
      <div className="flex items-center py-4 gap-4">
        <SearchBox placeholder={tGlobal("searchFor", { entity: t("title") })} />
        <ColumnVisibilityMenu<Role>
          columns={columns.filter((column) => column.canBeInvisible)}
          setVisibleColumns={setVisibleColumns}
        />
      </div>
      <div className="rounded-md border relative overflow-hidden">
        <Loader2
          className={cn(
            "size-5 animate-spin text-gray-500 transition-opacity absolute end-2 top-2 z-30",
            !isFetching && "opacity-0"
          )}
        />
        <Table>
          <TableHeader>
            <TableRow className="bg-white">
              {columns.map((column) =>
                !column.canBeInvisible || visibleColumns.includes(column.id) ? (
                  <TableHead key={column.id} className={cn("text-start", column.className)}>
                    {column.header}
                  </TableHead>
                ) : null
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white/70">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((column, cellIndex) => (
                    <TableCell key={`skeleton-cell-${cellIndex}`}>
                      <Skeleton className="h-6 w-full bg-gray-200" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (data || []).length > 0 ? (
              data?.map((role) => (
                <TableRow key={role.id}>
                  {columns.map((column) =>
                    !column.canBeInvisible || visibleColumns.includes(column.id) ? (
                      <TableCell key={column.id}>
                        {column.cell ? column.cell(role) : null}
                      </TableCell>
                    ) : null
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <CustomPagination paginationData={pagination} isLoading={isFetching} />
    </div>
  );
}

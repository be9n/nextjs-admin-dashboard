"use client";

import CustomPagination from "@/components/CustomPagination";
import { Pagination } from "@/app/types/global";
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
import { getColumns } from "./Columns";
import FiltersContainer from "./FiltersContainer";
import { Product } from "@/app/services/products";

interface DataTableProps {
  data?: Product[];
  pagination?: Pagination;
  isLoading?: boolean;
  isFetching?: boolean;
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
  visibleColumns: string[];
  setSelectedProductIds: React.Dispatch<React.SetStateAction<number[]>>;
  selectedProductIds: number[];
}

export default function DataTable({
  data,
  pagination,
  isLoading = false,
  isFetching = false,
  setVisibleColumns,
  visibleColumns,
  setSelectedProductIds,
  selectedProductIds,
}: DataTableProps) {
  const allProductIds = data?.map((product) => product.id);
  const columns = getColumns(
    selectedProductIds,
    setSelectedProductIds,
    allProductIds
  );

  return (
    <div>
      <div className="flex items-center py-4 gap-4">
        <SearchBox placeholder="Search For Products" />
        <FiltersContainer />
        <ColumnVisibilityMenu<Product>
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
                  <TableHead key={column.id} className={column.className}>
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
              data?.map((product) => (
                <TableRow key={product.id}>
                  {columns.map((column) =>
                    !column.canBeInvisible ||
                    visibleColumns.includes(column.id) ? (
                      <TableCell key={column.id}>
                        {column.cell ? column.cell(product) : null}
                      </TableCell>
                    ) : null
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
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

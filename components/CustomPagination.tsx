"use client";

import { Button } from "@/components/ui/button";
import { type Pagination } from "../app/types/global";
import { parseAsInteger, useQueryState } from "nuqs";

type PaginationProps = {
  paginationData?: Pagination;
  isLoading: boolean;
};

export default function CustomPagination({
  paginationData,
  isLoading,
}: PaginationProps) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={() => handlePageChange(page - 1)}
        disabled={!paginationData?.has_prev_page || isLoading}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={() => handlePageChange(page + 1)}
        disabled={!paginationData?.has_next_page || isLoading}
      >
        Next
      </Button>
    </div>
  );
}

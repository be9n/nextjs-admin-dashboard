"use client";

import { type Pagination as PaginationType } from "@/types/global";
import { Button } from "@/components/ui/button";
import { parseAsInteger, useQueryState } from "nuqs";

type PaginationProps = {
  paginationData?: PaginationType;
  isLoading: boolean;
};

export default function Pagination({
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
        disabled={!paginationData?.prev_page || isLoading}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={() => handlePageChange(page + 1)}
        disabled={!paginationData?.next_page || isLoading}
      >
        Next
      </Button>
    </div>
  );
}

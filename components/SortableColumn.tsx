"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { useCallback } from "react";

type SortDir = "asc" | "desc" | null;

type SortableColumnProps = {
  columnKey: string;
  title: string;
};

export const SortableColumn = ({ columnKey, title }: SortableColumnProps) => {
  const [, setPage] = useQueryState("page", { defaultValue: "" });
  const [{ sortBy, sortDir }, setSort] = useQueryStates(
    {
      sortBy: parseAsString.withDefault(""),
      sortDir: parseAsString.withDefault(""),
    },
    {
      urlKeys: {
        sortBy: "sort_by",
        sortDir: "sort_dir",
      },
    }
  );

  const updateSort = useCallback(
    (newSortBy: string | null, newSortDir: SortDir) => {
      setSort({
        sortBy: newSortBy,
        sortDir: newSortDir,
      });

      setPage(null);
    },
    [setSort, setPage]
  );

  const handleSort = useCallback(() => {
    // Start sorting this column ascending
    if (sortBy !== columnKey) {
      updateSort(columnKey, "asc");
      return;
    }

    // If already sorting by this column
    // Cycle through sort states: asc -> desc -> none
    if (sortDir === "asc") {
      updateSort(columnKey, "desc");
      return;
    }

    updateSort(null, null);
  }, [updateSort, columnKey, sortBy, sortDir]);

  const isSorted = sortBy === columnKey && sortDir;
  const isAsc = sortDir === "asc";

  return (
    <button
      onClick={handleSort}
      className="flex gap-2 group cursor-pointer hover:bg-gray-100 transition-colors"
    >
      {title}
      <span
        className={cn("group-hover:opacity-100 transition-opacity", {
          "opacity-0": !isSorted,
        })}
      >
        <ChevronUp
          className={cn("size-3 -mb-1 transition-opacity", {
            "opacity-0": isSorted && !isAsc,
          })}
        />
        <ChevronDown
          className={cn("size-3 transition-opacity", {
            "opacity-0": isSorted && isAsc,
          })}
        />
      </span>
    </button>
  );
};

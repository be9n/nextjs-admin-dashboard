"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export interface Filters {
  [key: string]: string | undefined;
}

export interface UseFiltersOptions {
  resetPageOnChange?: boolean;
  preserveOtherParams?: boolean;
}

const useFilters = (options: UseFiltersOptions = {}) => {
  const { resetPageOnChange = true, preserveOtherParams = true } = options;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Extract filters from URL parameters
  const filters = useMemo(() => {
    const extractedFilters: Filters = {};

    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith("filters[") && key.endsWith("]")) {
        const filterKey = key.slice(8, -1); // More efficient than replace
        extractedFilters[filterKey] = value;
      }
    }

    return extractedFilters;
  }, [searchParams]);

  const getPreparedFiltersObject = useCallback(() => {
    return Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== "") {
        acc[`filters[${key}]`] = value;
      }
      return acc;
    }, {} as Record<string, string>);
  }, [filters]);

  // Update filters in URL
  const setFilters = useCallback(
    (newFilters: Filters) => {
      const params = new URLSearchParams();

      // Preserve existing non-filter parameters if requested
      if (preserveOtherParams) {
        for (const [key, value] of searchParams.entries()) {
          if (!key.startsWith("filters[")) {
            params.set(key, value);
          }
        }
      }

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.set(`filters[${key}]`, value);
        }
      });

      if (resetPageOnChange) {
        params.delete("page");
      }

      // Using replace instead of push to avoid cluttering browser history
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router, resetPageOnChange, preserveOtherParams]
  );

  const clearFilter = useCallback(
    (filterKey: string) => {
      const updatedFilters = { ...filters };
      delete updatedFilters[filterKey];
      setFilters(updatedFilters);
    },
    [filters, setFilters]
  );

  const clearAllFilters = useCallback(() => {
    setFilters({});
  }, [setFilters]);

  // Update a single filter
  const updateFilter = useCallback(
    (key: string, value: string | undefined) => {
      setFilters({ ...filters, [key]: value });
    },
    [filters, setFilters]
  );

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(
      (value) => value !== undefined && value !== ""
    );
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) => value !== undefined && value !== ""
    ).length;
  }, [filters]);

  return {
    filters,
    getPreparedFiltersObject,
    setFilters,
    clearFilter,
    clearAllFilters,
    updateFilter,
    hasActiveFilters,
    activeFilterCount,
  };
};

export default useFilters;

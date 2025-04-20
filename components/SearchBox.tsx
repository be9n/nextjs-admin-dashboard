"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useDebounce } from "use-debounce";
import { useQueryState } from "nuqs";

type SearchBoxProps = {
  placeholder?: string;
};

export default function SearchBox({
  placeholder = "Search Here",
}: SearchBoxProps) {
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  
  const [searchTerm, setSearchTerm] = useState(search);
  const [debouncedSearch] = useDebounce(searchTerm, 200);

  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearch(debouncedSearch);
      setPage("");
    }
  }, [debouncedSearch, setSearch, search, page, setPage]);

  return (
    <Input
      placeholder={placeholder}
      className="max-w-sm"
      onChange={(e) => setSearchTerm(e.target.value)}
      defaultValue={search}
    />
  );
}

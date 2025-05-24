"use client";

import { ApiError } from "@/types/global";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import CategoryForm from "../../components/CategoryForm";
import { EditCategory } from "@/types/categories";
import { getCategory } from "@/services/categories";

export default function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    data: category,
    isError,
    error,
    isLoading,
  } = useQuery<EditCategory | null, ApiError>({
    queryKey: [`category_${id}`],
    queryFn: () => getCategory(id),
    staleTime: 0,
    gcTime: 0,
  });

  useErrorNotification({
    isError,
    title: "Something went wrong",
    description: error?.message || "",
  });

  return (
    <div className="py-8 px-3 lg:px-4">
      <div className="mb-8">
        <h1 className="font-bold text-3xl">
          Edit Category: {category?.name.en}
        </h1>
      </div>
      <CategoryForm category={category} isLoading={isLoading} />
    </div>
  );
}

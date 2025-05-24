"use client";

import { EditProduct, getProduct } from "@/services/products";
import { ApiError } from "@/types/global";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import ProductForm from "../../components/ProductForm";

export default function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    data: product,
    isError,
    error,
    isLoading,
  } = useQuery<EditProduct | null, ApiError>({
    queryKey: [`product_${id}`],
    queryFn: () => getProduct(id),
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
        <h1 className="font-bold text-3xl">Edit Product: {product?.name.en}</h1>
      </div>
      <ProductForm product={product} isLoading={isLoading} />
    </div>
  );
}

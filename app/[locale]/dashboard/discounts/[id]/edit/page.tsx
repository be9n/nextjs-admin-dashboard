"use client";

import { getDiscount } from "@/services/discounts";
import { ApiError } from "@/types/global";
import { useErrorNotification } from "@/hooks/useErrorNotification";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import DiscountForm from "../../components/DiscountForm";
import { EditDiscount } from "@/types/discounts";

export default function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    data: discount,
    isError,
    error,
    isLoading,
  } = useQuery<EditDiscount | null, ApiError>({
    queryKey: [`discount_${id}`],
    queryFn: () => getDiscount(id),
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
        <h1 className="font-bold text-3xl">Edit Discount: {discount?.name.en}</h1>
      </div>
      <DiscountForm discount={discount} isLoading={isLoading} />
    </div>
  );
}

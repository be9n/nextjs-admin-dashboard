"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CategoryListItem,
  getCategoriesList,
} from "@/app/[locale]/services/categories";
import { cn } from "@/lib/utils";
import { ApiError, SuccessApiResponse } from "@/app/[locale]/types/global";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  createProduct,
  EditProduct,
  updateProduct,
} from "@/app/[locale]/services/products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ProductFormSkeleton from "./ProductFormSkeleton";
import { setFormValidationErrors } from "@/lib/form-utils";
import FormButtons from "@/components/FormButtons";
import {
  useProductFormSchema,
  ProductFormValues,
} from "../schemas/productSchema";
import { routing } from "@/i18n/routing";
import { useTranslations } from "next-intl";

type ProductFormProps = {
  product?: EditProduct | null;
  isLoading?: boolean;
};

export default function ProductForm({ product, isLoading }: ProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const productFormSchema = useProductFormSchema();
  const tGlobal = useTranslations("global");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    values: {
      name: {
        en: product?.name.en ?? "",
        ar: product?.name.ar ?? "",
      },
      price: product?.price ?? 0,
      category_id: product?.category_id ?? 0,
    },
    mode: "onChange",
  });

  const {
    formState: { isSubmitting },
  } = form;

  const createProductMutation = useMutation({
    mutationFn: createProduct,
  });

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
  });

  const onSubmit = async (data: ProductFormValues) => {
    console.log(data);

    const mutationPromise = product
      ? updateProductMutation.mutateAsync({ data, productId: product.id })
      : createProductMutation.mutateAsync({ data });

    toast.promise(mutationPromise, {
      loading: product
        ? `Updating product: ${product.name.en}`
        : "Creating product...",
      success: (res: SuccessApiResponse) => {
        queryClient.invalidateQueries({
          queryKey: ["products", `product_${product?.id}`],
        });

        router.push("/dashboard/products");

        return {
          message: res.message || "Product created successfully!",
        };
      },
      error: (error: ApiError) => {
        setFormValidationErrors(form, error);

        return {
          message: "Something went wrong!",
          description:
            error.message || "An error occurred while creating the product",
        };
      },
    });

    try {
      await mutationPromise;
    } catch {}
  };

  return (
    <div className="mx-auto p-4 rounded-lg bg-white">
      {isLoading ? (
        <ProductFormSkeleton />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {routing.locales.map((locale) => (
                <FormField
                  key={locale}
                  control={form.control}
                  name={`name.${locale}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name In {tGlobal(locale)}</FormLabel>
                      <FormControl>
                        <Input placeholder="Product Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? 0}
                        placeholder="35$"
                        onChange={(e) => {
                          const value = e.target.value;

                          field.onChange(value == "" ? 0 : +value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CategorySelect
                form={form}
                parent_category_id={product?.parent_category_id}
              />
            </div>

            <FormButtons
              isSubmitting={isSubmitting}
              onCancel={() => router.back()}
            />
          </form>
        </Form>
      )}
    </div>
  );
}

const CategorySelect = ({
  form,
  parent_category_id,
}: {
  form: UseFormReturn<ProductFormValues>;
  parent_category_id?: number;
}) => {
  const { data: categoriesList, isLoading } = useQuery<
    CategoryListItem[] | null,
    ApiError
  >({
    queryKey: ["select_categories_list"],
    queryFn: async () =>
      getCategoriesList({ parentCategories: 1, withChildren: 1 }),
    staleTime: 0,
    gcTime: 0,
  });
  const [selectedParentCategoryId, setSelectedParentCategoryId] = useState<
    number | null
  >(parent_category_id || null);

  useEffect(() => {
    form.setValue("category_id", 0);
  }, [selectedParentCategoryId, form]);

  return (
    <div className="flex gap-4 flex-wrap">
      <ParentCategories
        categories={categoriesList || []}
        isLoading={isLoading}
        selectedParentCategoryId={selectedParentCategoryId}
        setSelectedParentCategoryId={setSelectedParentCategoryId}
      />
      <ChildCategories
        isLoading={isLoading}
        categories={
          categoriesList?.find((cat) => cat.id === selectedParentCategoryId)
            ?.children || []
        }
        form={form}
        disabled={!selectedParentCategoryId}
      />
    </div>
  );
};

const ParentCategories = ({
  isLoading,
  categories,
  selectedParentCategoryId,
  setSelectedParentCategoryId,
}: {
  isLoading?: boolean;
  categories: CategoryListItem[];
  selectedParentCategoryId: number | null;
  setSelectedParentCategoryId: (id: number | null) => void;
}) => {
  return (
    <div>
      <FormLabel className="mb-2">Parent Category</FormLabel>
      <Select
        value={selectedParentCategoryId?.toString() || "none"}
        onValueChange={(value) =>
          setSelectedParentCategoryId(value === "none" ? null : +value)
        }
      >
        <SelectTrigger className="cursor-pointer max-w-[150px]">
          {isLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <SelectValue placeholder="Select Parent Category" />
          )}
        </SelectTrigger>
        <SelectContent className="w-55">
          <SelectItem className="cursor-pointer" key="clear" value="none">
            Select Parent Category
          </SelectItem>
          {isLoading ? (
            <div className="space-y-2 mt-3">
              <Skeleton className="h-7 w-full bg-gray-200" />
              <Skeleton className="h-7 w-full bg-gray-200" />
              <Skeleton className="h-7 w-full bg-gray-200" />
            </div>
          ) : (
            <>
              <div className="space-y-1 mt-1">
                {(categories || []).map((item) => (
                  <SelectItem
                    className={cn("cursor-pointer w-full", {
                      "bg-gray-100": item.id === selectedParentCategoryId,
                    })}
                    key={item.id}
                    value={item.id.toString()}
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </div>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

const ChildCategories = ({
  isLoading,
  categories,
  disabled,
  form,
}: {
  isLoading?: boolean;
  categories: CategoryListItem[];
  form: UseFormReturn<ProductFormValues>;
  disabled: boolean;
}) => {
  return (
    <FormField
      control={form.control}
      name="category_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select
            disabled={disabled}
            onValueChange={(value) => {
              if (value) field.onChange(value === "none" ? 0 : Number(value));
            }}
            value={field.value === 0 ? "none" : field.value?.toString()}
          >
            <FormControl>
              <SelectTrigger className="cursor-pointer max-w-[150px]">
                {isLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <SelectValue placeholder="Select Category" />
                )}
              </SelectTrigger>
            </FormControl>
            <SelectContent className="w-50">
              <SelectItem className="cursor-pointer" key="clear" value="none">
                Select Category
              </SelectItem>
              <div className="space-y-1 mt-1">
                {(categories || []).map((item) => (
                  <SelectItem
                    className={cn("cursor-pointer w-full", {
                      "bg-gray-100": item.id === field.value,
                    })}
                    key={item.id}
                    value={item.id.toString()}
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

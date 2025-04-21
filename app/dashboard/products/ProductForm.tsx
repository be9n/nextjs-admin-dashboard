"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryListItem, getCategoriesList } from "@/app/services/categories";
import { cn } from "@/lib/utils";
import { ApiError } from "@/app/types/global";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { createProduct } from "@/app/services/products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, { message: "The name is required" }),
  price: z.number().min(0, { message: "Must be equal or greater than 1" }),
  category_id: z.number().min(1, { message: "req" }),
});

export type ProductFormValues = z.infer<typeof formSchema>;

export default function ProductForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      category_id: 0,
    },
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
  });

  const onSubmit = (values: ProductFormValues) => {
    toast.promise(createProductMutation.mutateAsync(values), {
      loading: "Creating product...",
      success: (res) => {
        queryClient.invalidateQueries({ queryKey: ["products"] });

        router.push("/dashboard/products");

        return {
          message: res.message || "Product created successfully!",
        };
      },
      error: (error: ApiError) => {
        return error.message || "An error occurred while creating the product";
      },
    });
  };

  return (
    <div className="mx-auto p-4 rounded-lg bg-white xl:w-220">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className=" grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    This is the product&apos;s display name
                  </FormDescription>
                </FormItem>
              )}
            />
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
                  <FormDescription>
                    This is the product&apos;s price
                  </FormDescription>
                </FormItem>
              )}
            />

            <CategorySelect form={form} />
          </div>
          <Button type="submit" className="cursor-pointer">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

const CategorySelect = ({
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
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
  >(null);

  useEffect(() => {
    form.resetField("category_id");
  }, [selectedParentCategoryId, form]);

  return (
    <div className="flex gap-4">
      <ParentCategories
        categories={categoriesList || []}
        isLoading={isLoading}
        selectedParentCategoryId={selectedParentCategoryId}
        setSelectedParentCategoryId={setSelectedParentCategoryId}
      />
      <ChildCategories
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
  isLoading: boolean;
  categories: CategoryListItem[];
  selectedParentCategoryId: number | null;
  setSelectedParentCategoryId: (id: number | null) => void;
}) => {
  return (
    <div>
      <FormLabel className="mb-2">Parent Category</FormLabel>
      <Select
        onValueChange={(value) =>
          setSelectedParentCategoryId(value === "none" ? null : +value)
        }
      >
        <SelectTrigger className="w-[180px] cursor-pointer">
          <SelectValue placeholder="Select A Category" />
        </SelectTrigger>
        <SelectContent className="w-50">
          <SelectItem className="cursor-pointer" key="clear" value="none">
            None
          </SelectItem>
          {isLoading ? (
            <div className="space-y-2 mt-3">
              <Skeleton className="h-7 w-full bg-gray-200" />
              <Skeleton className="h-7 w-full bg-gray-200" />
              <Skeleton className="h-7 w-full bg-gray-200" />
            </div>
          ) : (
            <>
              <div className="space-y-1">
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
  categories,
  disabled,
  form,
}: {
  categories: CategoryListItem[];
  form: UseFormReturn<z.infer<typeof formSchema>>;
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
              field.onChange(value === "none" ? 0 : Number(value));
            }}
            value={field.value === 0 ? "none" : field.value?.toString()}
          >
            <FormControl>
              <SelectTrigger className="w-[180px] cursor-pointer">
                <SelectValue placeholder="Select A Category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="w-50">
              <SelectItem className="cursor-pointer" key="clear" value="none">
                All Categories
              </SelectItem>
              <div className="space-y-1">
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

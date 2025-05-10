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
  createCategory,
  getCategoriesList,
  updateCategory,
} from "@/app/[locale]/services/categories";
import { cn } from "@/lib/utils";
import { ApiError, SuccessApiResponse } from "@/app/[locale]/types/global";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";
import { setFormValidationErrors } from "@/lib/form-utils";
import FormButtons from "@/components/FormButtons";
import {
  useCategoryFormSchema,
  CategoryFormValues,
} from "../schemas/categorySchema";
import { routing } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ProductFormSkeleton from "../../products/components/ProductFormSkeleton";
import {
  CategoryListItem,
  EditCategory,
} from "@/app/[locale]/types/categories";
import ImageUploader from "@/components/ImageUploader";
import { useEffect, useState } from "react";

type CategoryFormProps = {
  category?: EditCategory | null;
  isLoading?: boolean;
};

export default function CategoryForm({
  category,
  isLoading,
}: CategoryFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const categoryFormSchema = useCategoryFormSchema(!!category);
  const tGlobal = useTranslations("global");
  const [activeTab, setActiveTab] = useState<string>("en");

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    values: {
      name: {
        en: category?.name.en ?? "",
        ar: category?.name.ar ?? "",
      },
      parent_id: category?.parent_id ?? 0,
      image: undefined,
    },
    mode: "onChange",
  });

  const {
    formState: { isSubmitting, errors },
  } = form;

  // Switch to the first tab with an error when validation fails
  useEffect(() => {
    if (errors.name) {
      const localeWithError = routing.locales.find(
        (locale) => errors.name?.[locale]
      );
      if (localeWithError) {
        setActiveTab(localeWithError);
      }
    }
  }, [errors.name]);

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
  });

  const onSubmit = async (data: CategoryFormValues) => {
    const mutationPromise = category
      ? updateCategoryMutation.mutateAsync({ data, categoryId: category.id })
      : createCategoryMutation.mutateAsync({ data });

    toast.promise(mutationPromise, {
      loading: category
        ? `Updating category: ${category.name.en}`
        : "Creating category...",
      success: (res: SuccessApiResponse) => {
        queryClient.invalidateQueries({
          queryKey: ["categories", `category_${category?.id}`],
        });

        router.push("/dashboard/categories");

        return {
          message: res.message || "Category created successfully!",
        };
      },
      error: (error: ApiError) => {
        setFormValidationErrors(form, error);

        return {
          message: "Something went wrong!",
          description:
            error.message || "An error occurred while creating the category",
        };
      },
    });

    try {
      await mutationPromise;
    } catch {}
  };

  return isLoading ? (
    <ProductFormSkeleton />
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:items-start">
          <Card className="p-4 lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-2">
                {routing.locales.map((locale) => (
                  <TabsTrigger
                    className={cn("cursor-pointer", {
                      "text-destructive": !!errors.name?.[locale],
                    })}
                    key={locale}
                    value={locale}
                  >
                    {tGlobal(locale)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {routing.locales.map((locale) => (
                <TabsContent key={locale} value={locale} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                    <FormField
                      control={form.control}
                      name={`name.${locale}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Product Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <CategorySelect form={form} />
            </div>

            <FormButtons
              isSubmitting={isSubmitting}
              onCancel={() => redirect("/dashboard/categories")}
              submitDisabled={Object.keys(form.formState.errors).length > 0}
            />
          </Card>
          <ImageUploader<CategoryFormValues>
            form={form}
            uploaded={category?.image}
            inputName="image"
            label="Category Image"
          />
        </div>
      </form>
    </Form>
  );
}

const CategorySelect = ({
  form,
}: {
  form: UseFormReturn<CategoryFormValues>;
}) => {
  const { data: categoriesList, isLoading } = useQuery<
    CategoryListItem[] | null,
    ApiError
  >({
    queryKey: ["select_categories_list"],
    queryFn: async () =>
      getCategoriesList({ parentCategories: 1, withChildren: 0 }),
    staleTime: 0,
    gcTime: 0,
  });

  return (
    <div className="flex gap-4 flex-wrap">
      <ParentCategories
        categories={categoriesList || []}
        isLoading={isLoading}
        form={form}
      />
    </div>
  );
};

const ParentCategories = ({
  isLoading,
  categories,
  form,
}: {
  isLoading?: boolean;
  categories: CategoryListItem[];
  form: UseFormReturn<CategoryFormValues>;
}) => {
  return (
    <FormField
      control={form.control}
      name="parent_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select
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

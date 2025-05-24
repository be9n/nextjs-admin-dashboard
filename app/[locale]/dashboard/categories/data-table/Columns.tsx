import { ApiError, TableColumn } from "@/types/global";
import { SortableColumn } from "@/components/SortableColumn";
import SelectRow from "@/components/SelectRow";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  deleteCategory,
  PaginatedCategories,
} from "@/services/categories";
import { Badge } from "@/components/ui/badge";
import { MUTATION_CACHE_UPDATE_DELAY } from "@/constants/timing";
import DeleteDialog from "@/components/DeleteDialog";
import { Category } from "@/types/categories";

// Custom hook to get translated columns
export function useColumns(
  selectedIds: number[],
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>,
  allCategoryIds?: number[]
) {
  const t = useTranslations("categories.columns");

  const columns: TableColumn<Category>[] = [
    {
      canBeInvisible: false,
      id: "select",
      header: (
        <SelectRow
          selectAll={true}
          allRowIds={allCategoryIds}
          selectedRowIds={selectedIds}
          setSelectedRowIds={setSelectedIds}
        />
      ),
      className: "w-8",
      cell: (category: Category) => (
        <SelectRow
          rowId={category.id}
          selectedRowIds={selectedIds}
          setSelectedRowIds={setSelectedIds}
        />
      ),
    },
    {
      id: "id",
      title: t("id"),
      header: <SortableColumn columnKey="id" title={t("id")} />,
      cell: (category: Category) => category.id,
    },
    {
      canBeInvisible: true,
      id: "name",
      title: t("name"),
      header: <SortableColumn columnKey="name" title={t("name")} />,
      cell: (category: Category) => category.name,
    },
    {
      canBeInvisible: true,
      id: "parent_category_name",
      title: t("parentCategoryName"),
      header: t("parentCategoryName"),
      cell: (category: Category) =>
        category.parent_category_name || (
          <Badge className="bg-blue-400/80 hover:bg-blue-400 transition-all">
            Parent Category
          </Badge>
        ),
    },
    {
      canBeInvisible: true,
      id: "products_count",
      title: t("productsCount"),
      header: t("productsCount"),
      cell: (category: Category) => category.products_count,
    },
    {
      canBeInvisible: false,
      id: "actions",
      header: t("actions"),
      cell: (category: Category) => {
        return <ActionsMenu category={category} />;
      },
    },
  ];

  return columns;
}

const ActionsMenu = ({ category }: { category: Category }) => {
  const t = useTranslations("categories.columns");
  const menuT = useTranslations("categories.menu");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 cursor-pointer hover:bg-gray-200"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigator.clipboard.writeText(category.id.toString())}
        >
          {menuT("copyCategoryId")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={`/dashboard/categories/${category.id}/edit`}>
            {menuT("editCategory")}
          </Link>
        </DropdownMenuItem>
        <DeleteCategoryAction category={category} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DeleteCategoryAction = ({ category }: { category: Category }) => {
  const menuT = useTranslations("categories.menu");
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (res) => {
      setTimeout(() => {
        queryClient.setQueriesData(
          { queryKey: ["categories"] },
          (old: PaginatedCategories) => ({
            ...old,
            data: old.data.filter((c: Category) => c.id !== category.id),
          })
        );
      }, MUTATION_CACHE_UPDATE_DELAY);
      toast.success(res.message || "Deleted successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Something went wrong while deleting");
    },
  });

  return (
    <DeleteDialog
      action={() => deleteMutation.mutateAsync(category.id)}
      title={menuT("delete")}
      description={menuT("deleteDescription")}
    >
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        className="cursor-pointer"
        variant="destructive"
      >
        {menuT("delete")}
      </DropdownMenuItem>
    </DeleteDialog>
  );
};

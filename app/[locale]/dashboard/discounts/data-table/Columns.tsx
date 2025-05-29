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
import { MUTATION_CACHE_UPDATE_DELAY } from "@/constants/timing";
import DeleteDialog from "@/components/DeleteDialog";
import ToggleActive from "@/components/ToggleActive";
import { Discount, PaginatedDiscounts } from "@/types/discounts";
import { deleteDiscount, updateDiscountActive } from "@/services/discounts";

// Custom hook to get translated columns
export function useColumns(
  selectedDiscountIds: number[],
  setSelectedDiscountIds: React.Dispatch<React.SetStateAction<number[]>>,
  allDiscountIds?: number[]
) {
  const t = useTranslations("discounts.columns");
  const tGlobal = useTranslations("global");
  const queryClient = useQueryClient();

  const columns: TableColumn<Discount>[] = [
    {
      canBeInvisible: false,
      id: "select",
      header: (
        <SelectRow
          selectAll={true}
          allRowIds={allDiscountIds}
          selectedRowIds={selectedDiscountIds}
          setSelectedRowIds={setSelectedDiscountIds}
        />
      ),
      className: "w-8",
      cell: (discount: Discount) => (
        <SelectRow
          rowId={discount.id}
          selectedRowIds={selectedDiscountIds}
          setSelectedRowIds={setSelectedDiscountIds}
        />
      ),
    },
    {
      id: "id",
      title: t("id"),
      header: <SortableColumn columnKey="id" title={t("id")} />,
      cell: (discount: Discount) => discount.id,
    },
    {
      canBeInvisible: true,
      id: "name",
      title: t("name"),
      header: <SortableColumn columnKey="name" title={t("name")} />,
      cell: (discount: Discount) => discount.name,
    },
    {
      canBeInvisible: true,
      id: "type",
      title: t("type"),
      header: <SortableColumn columnKey="type" title={t("type")} />,
      cell: (discount: Discount) => discount.type,
    },
    {
      canBeInvisible: true,
      id: "value",
      title: t("value"),
      header: <SortableColumn columnKey="value" title={t("value")} />,
      cell: (discount: Discount) => discount.value,
    },
    {
      canBeInvisible: true,
      id: "start_date",
      title: t("start_date"),
      header: <SortableColumn columnKey="start_date" title={t("start_date")} />,
      cell: (discount: Discount) => discount.start_date,
    },
    {
      canBeInvisible: true,
      id: "end_date",
      title: t("end_date"),
      header: <SortableColumn columnKey="end_date" title={t("end_date")} />,
      cell: (discount: Discount) => discount.end_date,
    },
    {
      canBeInvisible: true,
      id: "max_uses",
      title: t("max_uses"),
      header: <SortableColumn columnKey="max_uses" title={t("max_uses")} />,
      cell: (discount: Discount) => discount.max_uses,
    },
    {
      canBeInvisible: true,
      id: "used_count",
      title: t("used_count"),
      header: <SortableColumn columnKey="used_count" title={t("used_count")} />,
      cell: (discount: Discount) => discount.used_count,
    },
    {
      canBeInvisible: true,
      id: "active",
      title: tGlobal("active"),
      header: tGlobal("active"),
      cell: (discount: Discount) => {
        return (
          <ToggleActive
            defaultChecked={discount.active}
            onChange={async (active: boolean) => {
              await updateDiscountActive({
                discountId: discount.id,
                active,
              });

              queryClient.invalidateQueries({
                queryKey: ["discounts"],
              });
            }}
          />
        );
      },
    },
    {
      canBeInvisible: true,
      id: "created_at",
      title: t("created_at"),
      header: <SortableColumn columnKey="created_at" title={t("created_at")} />,
      cell: (discount: Discount) => discount.created_at,
    },
    {
      canBeInvisible: false,
      id: "actions",
      header: tGlobal("actions"),
      cell: (discount: Discount) => {
        return <ActionsMenu discount={discount} />;
      },
    },
  ];

  return columns;
}

const ActionsMenu = ({ discount }: { discount: Discount }) => {
  const menuT = useTranslations("discounts.menu");
  const tGlobal = useTranslations("global");

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
        <DropdownMenuLabel>{tGlobal("actions")}</DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigator.clipboard.writeText(discount.id.toString())}
        >
          {menuT("copyDiscountId")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={`/dashboard/discounts/${discount.id}/edit`}>
            {menuT("editDiscount")}
          </Link>
        </DropdownMenuItem>
        <DeleteDiscountAction discount={discount} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DeleteDiscountAction = ({ discount }: { discount: Discount }) => {
  const menuT = useTranslations("discounts.menu");
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteDiscount,
    onSuccess: (res) => {
      setTimeout(() => {
        queryClient.setQueriesData(
          { queryKey: ["discounts"] },
          (old: PaginatedDiscounts) => ({
            ...old,
            data: old.data.filter((d: Discount) => d.id !== discount.id),
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
    <DeleteDialog action={() => deleteMutation.mutateAsync(discount.id)}>
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

import { ApiError, TableColumn } from "@/app/[locale]/types/global";
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
import { deleteProduct, Product } from "@/app/[locale]/services/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteDialog2 from "@/components/DeleteDialog2";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Custom hook to get translated columns
export function useColumns(
  selectedProductIds: number[],
  setSelectedProductIds: React.Dispatch<React.SetStateAction<number[]>>,
  allProductIds?: number[]
) {
  const t = useTranslations("products.columns");

  const columns: TableColumn<Product>[] = [
    {
      canBeInvisible: false,
      id: "select",
      header: (
        <SelectRow
          selectAll={true}
          allRowIds={allProductIds}
          selectedRowIds={selectedProductIds}
          setSelectedRowIds={setSelectedProductIds}
        />
      ),
      className: "w-8",
      cell: (product: Product) => (
        <SelectRow
          rowId={product.id}
          selectedRowIds={selectedProductIds}
          setSelectedRowIds={setSelectedProductIds}
        />
      ),
    },
    {
      id: "id",
      title: t("id"),
      header: <SortableColumn columnKey="id" title={t("id")} />,
      cell: (product: Product) => product.id,
    },
    {
      canBeInvisible: true,
      id: "name",
      title: t("name"),
      header: <SortableColumn columnKey="name" title={t("name")} />,
      cell: (product: Product) => product.name,
    },
    {
      canBeInvisible: true,
      id: "price",
      title: t("price"),
      header: <SortableColumn columnKey="price" title={t("price")} />,
      cell: (product: Product) => {
        const amount = parseFloat(product.price.toString());
        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return formattedPrice;
      },
    },
    {
      canBeInvisible: true,
      id: "category_name",
      title: t("categoryName"),
      header: t("categoryName"),
      cell: (product: Product) => product.category_name,
    },
    {
      canBeInvisible: false,
      id: "actions",
      header: t("actions"),
      cell: (product: Product) => {
        return <ActionsMenu product={product} />;
      },
    },
  ];

  return columns;
}

// For backward compatibility
export function getColumns(
  selectedProductIds: number[],
  setSelectedProductIds: React.Dispatch<React.SetStateAction<number[]>>,
  allProductIds?: number[]
) {
  // Use the useColumns hook instead of this function in components
  const columns: TableColumn<Product>[] = [
    {
      canBeInvisible: false,
      id: "select",
      header: (
        <SelectRow
          selectAll={true}
          allRowIds={allProductIds}
          selectedRowIds={selectedProductIds}
          setSelectedRowIds={setSelectedProductIds}
        />
      ),
      className: "w-8",
      cell: (product: Product) => (
        <SelectRow
          rowId={product.id}
          selectedRowIds={selectedProductIds}
          setSelectedRowIds={setSelectedProductIds}
        />
      ),
    },
    {
      id: "id",
      title: "ID",
      header: <SortableColumn columnKey="id" title="ID" />,
      cell: (product: Product) => product.id,
    },
    {
      canBeInvisible: true,
      id: "name",
      title: "Name",
      header: <SortableColumn columnKey="name" title="Name" />,
      cell: (product: Product) => product.name,
    },
    {
      canBeInvisible: true,
      id: "price",
      title: "Price",
      header: <SortableColumn columnKey="price" title="Price" />,
      cell: (product: Product) => {
        const amount = parseFloat(product.price.toString());
        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return formattedPrice;
      },
    },
    {
      canBeInvisible: true,
      id: "category_name",
      title: "Category Name",
      header: "Category Name",
      cell: (product: Product) => product.category_name,
    },
    {
      canBeInvisible: false,
      id: "actions",
      header: "Actions",
      cell: (product: Product) => {
        return <ActionsMenu product={product} />;
      },
    },
  ];

  return columns;
}

const ActionsMenu = ({ product }: { product: Product }) => {
  const t = useTranslations("products.columns");
  const menuT = useTranslations("products.menu");

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
          onClick={() => navigator.clipboard.writeText(product.id.toString())}
        >
          {menuT("copyProductId")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={`/dashboard/products/${product.id}/edit`}>
            {menuT("editProduct")}
          </Link>
        </DropdownMenuItem>
        <DeleteProductAction product={product} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DeleteProductAction = ({ product }: { product: Product }) => {
  const menuT = useTranslations("products.menu");
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
        exact: false,
      });
      toast.success(res.message || "Deleted successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Something went wrong while deleting");
    },
  });

  return (
    <DeleteDialog2
      action={() => deleteMutation.mutateAsync(product.id)}
    >
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        className="cursor-pointer"
        variant="destructive"
      >
        {menuT("delete")}
      </DropdownMenuItem>
    </DeleteDialog2>
  );
};

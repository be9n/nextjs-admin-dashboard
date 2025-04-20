import { TableColumn } from "@/app/types/global";
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
import { deleteProduct, Product } from "@/app/services/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteDialog2 from "@/components/DeleteDialog2";

export function getColumns(
  selectedProductIds: number[],
  setSelectedProductIds: React.Dispatch<React.SetStateAction<number[]>>,
  allProductIds?: number[]
) {
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
      id: "category_name",
      title: "Category Name",
      header: "Category Name",
      cell: (product: Product) => product.category_name,
    },
    {
      canBeInvisible: true,
      id: "price",
      title: "Price",
      header: <SortableColumn columnKey="price" title="Price" />,
      cell: (product: Product) => product.price,
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
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigator.clipboard.writeText(product.id.toString())}
        >
          Copy product ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          View Product
        </DropdownMenuItem>
        <DeleteProductAction product={product} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DeleteProductAction = ({ product }: { product: Product }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const onConfirm = async () => {
    await deleteMutation.mutateAsync(product.id);
  };

  return (
    <DeleteDialog2 action={onConfirm} isLoading={deleteMutation.isPending}>
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        className="cursor-pointer"
        variant="destructive"
      >
        Delete
      </DropdownMenuItem>
    </DeleteDialog2>
  );
};

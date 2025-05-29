import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useCallback, useEffect, useState } from "react";
import { TableColumn } from "@/types/global";
import { Eye, EyeClosed } from "lucide-react";

interface ColumnVisibilityMenuProps<T> {
  columns: TableColumn<T>[];
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ColumnVisibilityMenu<T>({
  columns,
  setVisibleColumns,
}: ColumnVisibilityMenuProps<T>) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns.map((column) => column.id)
  );

  const isSelected = (columnId: string) => {
    return selectedColumns.includes(columnId);
  };

  const someInvisible = () => {
    return selectedColumns.length < columns.length;
  };

  const toggleSelected = useCallback((columnId: string) => {
    setSelectedColumns((prev) => {
      if (prev.includes(columnId)) {
        return prev.filter((id) => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  }, []);

  useEffect(() => {
    setVisibleColumns(selectedColumns);
  }, [selectedColumns, setVisibleColumns]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto cursor-pointer">
          {someInvisible() ? <EyeClosed /> : <Eye />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="capitalize cursor-pointer"
            checked={isSelected(column.id)}
            onCheckedChange={() => toggleSelected(column.id)}
            onSelect={(e) => e.preventDefault()}
          >
            {column.title}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

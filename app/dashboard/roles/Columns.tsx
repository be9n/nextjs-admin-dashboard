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
import { Role } from "@/app/services/roles";

export function getColumns(
  selectedRoleIds: number[],
  setSelectedRoleIds: React.Dispatch<React.SetStateAction<number[]>>,
  allRoleIds?: number[]
) {
  const columns: TableColumn<Role>[] = [
    {
      canBeInvisible: false,
      id: "select",
      header: (
        <SelectRow
          selectAll={true}
          allRowIds={allRoleIds}
          selectedRowIds={selectedRoleIds}
          setSelectedRowIds={setSelectedRoleIds}
        />
      ),
      className: "w-8",
      cell: (role: Role) => (
        <SelectRow
          rowId={role.id}
          selectedRowIds={selectedRoleIds}
          setSelectedRowIds={setSelectedRoleIds}
        />
      ),
    },
    {
      canBeInvisible: true,
      id: "id",
      title: "ID",
      header: <SortableColumn columnKey="id" title="ID" />,
      cell: (role: Role) => role.id,
    },
    {
      canBeInvisible: true,
      id: "title",
      title: "Title",
      header: <SortableColumn columnKey="title" title="Title" />,
      cell: (role: Role) => role.title,
    },
    {
      canBeInvisible: true,
      id: "permissions_count",
      title: "Permissions Count",
      header: (
        <SortableColumn
          columnKey="permissions_count"
          title="Permissions Count"
        />
      ),
      cell: (role: Role) => role.permissions_count,
    },
    {
      canBeInvisible: false,
      id: "actions",
      header: "Actions",
      cell: (role: Role) => {
        return <ActionsMenu role={role} />;
      },
    },
  ];

  return columns;
}

const ActionsMenu = ({ role }: { role: Role }) => {
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
          onClick={() => navigator.clipboard.writeText(role.id.toString())}
        >
          Copy role ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          View Role
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" variant="destructive">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

import { TableColumn } from "@/app/[locale]/types/global";
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
import { Role } from "@/app/[locale]/services/roles";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Custom hook to get translated columns
export function useColumns(
  selectedRoleIds: number[],
  setSelectedRoleIds: React.Dispatch<React.SetStateAction<number[]>>,
  allRoleIds?: number[]
) {
  const t = useTranslations("RolesPage.columns");
  
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
      title: t("id"),
      header: <SortableColumn columnKey="id" title={t("id")} />,
      cell: (role: Role) => role.id,
    },
    {
      canBeInvisible: true,
      id: "title",
      title: t("title"),
      header: <SortableColumn columnKey="title" title={t("title")} />,
      cell: (role: Role) => role.title,
    },
    {
      canBeInvisible: true,
      id: "permissions_count",
      title: t("permissionsCount"),
      header: (
        <SortableColumn
          columnKey="permissions_count"
          title={t("permissionsCount")}
        />
      ),
      cell: (role: Role) => role.permissions_count,
    },
    {
      canBeInvisible: false,
      id: "actions",
      header: t("actions"),
      cell: (role: Role) => {
        return <ActionsMenu role={role} />;
      },
    },
  ];

  return columns;
}

const ActionsMenu = ({ role }: { role: Role }) => {
  const t = useTranslations("RolesPage.columns");
  
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
          onClick={() => navigator.clipboard.writeText(role.id.toString())}
        >
          Copy role ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`/dashboard/roles/${role.id}/edit`}>Edit Role</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" variant="destructive">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

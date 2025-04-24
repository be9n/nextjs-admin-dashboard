"use client"

import { PermissionNode } from "@/app/types/global";
import { Checkbox } from "@/components/ui/checkbox";
import { FormLabel } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import PermissionNodes from "./PermissionNodes";

const SubPermissionGroupNodes = ({
  subPermissionGroups,
  toggleKeys,
  isChecked,
}: {
  subPermissionGroups: PermissionNode[];
  toggleKeys: (checked: boolean, node?: PermissionNode) => void;
  isChecked: (node: PermissionNode) => boolean;
}) => {
  return (
    <div className="flex flex-col gap-3 ms-3">
      {subPermissionGroups.map((subPermissionGroup, index) => (
        <div key={subPermissionGroup.id}>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 min-w-[250px]">
              <Checkbox
                className="cursor-pointer"
                checked={isChecked(subPermissionGroup)}
                onCheckedChange={(checked) => {
                  toggleKeys(checked as boolean, subPermissionGroup);
                }}
              />
              <FormLabel destructiveOnError={false} className="cursor-pointer">
                {subPermissionGroup.name}
              </FormLabel>
            </div>

            <PermissionNodes
              permissions={subPermissionGroup.children || []}
              toggleKeys={toggleKeys}
              isChecked={isChecked}
            />
          </div>

          {index !== subPermissionGroups.length - 1 && (
            <Separator className="mt-3" />
          )}
        </div>
      ))}
    </div>
  );
};

export default SubPermissionGroupNodes;

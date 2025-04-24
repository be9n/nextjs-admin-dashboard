"use client";

import { PermissionNode } from "@/app/types/global";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import PermissionNodes from "./PermissionNodes";
import { Label } from "@radix-ui/react-label";

const SubPermissionGroupNodes = ({
  subPermissionGroups,
  toggleNames,
  isChecked,
}: {
  subPermissionGroups: PermissionNode[];
  toggleNames: (checked: boolean, node?: PermissionNode) => void;
  isChecked: (node: PermissionNode) => boolean;
}) => {
  return (
    <div className="flex flex-col gap-3 ms-3">
      {subPermissionGroups.map((subPermissionGroup, index) => (
        <div key={subPermissionGroup.id}>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 min-w-[250px]">
              <Checkbox
                id={`${subPermissionGroup.name}`}
                className="cursor-pointer"
                checked={isChecked(subPermissionGroup)}
                onCheckedChange={(checked) => {
                  toggleNames(checked as boolean, subPermissionGroup);
                }}
              />
              <Label
                htmlFor={`${subPermissionGroup.name}`}
                className="cursor-pointer"
              >
                {subPermissionGroup.title}
              </Label>
            </div>

            <PermissionNodes
              permissions={subPermissionGroup.children || []}
              toggleNames={toggleNames}
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

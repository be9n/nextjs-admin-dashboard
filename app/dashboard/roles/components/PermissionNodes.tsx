"use client"

import { PermissionNode } from "@/app/types/global";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import React from "react";

const PermissionNodes = ({
  permissions,
  toggleKeys,
  isChecked,
}: {
  permissions: PermissionNode[];
  toggleKeys: (checked: boolean, node?: PermissionNode) => void;
  isChecked: (node: PermissionNode) => boolean;
}) => {
  return (
    <div>
      <div className="flex items-center gap-4 flex-wrap ms-4">
        {permissions.map((permission) => (
          <FormItem key={permission.id} className="flex items-center gap-2">
            <FormControl>
              <Checkbox
                className="cursor-pointer"
                checked={isChecked(permission)}
                onCheckedChange={(checked: boolean) => {
                  toggleKeys(checked, permission);
                }}
              />
            </FormControl>
            <FormLabel className="text-sm font-normal cursor-pointer">
              {permission.name}
            </FormLabel>
          </FormItem>
        ))}
      </div>
    </div>
  );
};

export default PermissionNodes;

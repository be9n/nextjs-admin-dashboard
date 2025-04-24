"use client"

import { Checkbox } from "@/components/ui/checkbox";
import { FormLabel } from "@/components/ui/form";
import React from "react";

const SelectAllPermissionNodes = ({
  toggleNames,
  isChecked,
}: {
  toggleNames: (checked: boolean) => void;
  isChecked: () => boolean;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        className="cursor-pointer"
        checked={isChecked()}
        onCheckedChange={(checked) => toggleNames(checked as boolean)}
      />

      <FormLabel
        destructiveOnError={false}
        className="text-md cursor-pointer text-foreground"
      >
        Select All
      </FormLabel>
    </div>
  );
};

export default SelectAllPermissionNodes;

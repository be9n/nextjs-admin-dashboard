"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
        id="select-all"
        className="cursor-pointer"
        checked={isChecked()}
        onCheckedChange={(checked) => toggleNames(checked as boolean)}
      />

      <Label
        htmlFor="select-all"
        className="text-md cursor-pointer text-foreground"
      >
        Select All
      </Label>
    </div>
  );
};

export default SelectAllPermissionNodes;

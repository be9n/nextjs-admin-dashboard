"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import SubPermissionGroupNodes from "./SubPermissionGroupNodes";
import { PermissionNode } from "@/app/[locale]/types/global";

const MainPermissionGroups = ({
  permissionGroups,
  toggleNames,
  isChecked,
}: {
  permissionGroups: PermissionNode[];
  toggleNames: (checked: boolean, node?: PermissionNode) => void;
  isChecked: (node: PermissionNode) => boolean;
}) => {
  return (
    <Accordion
      type="multiple"
      defaultValue={permissionGroups.map((item) => item.id.toString())}
    >
      {permissionGroups.map((permissionGroup) => (
        <AccordionItem
          key={permissionGroup.id}
          value={permissionGroup.id.toString()}
        >
          <div className="flex items-center gap-2">
            <Checkbox
              className="cursor-pointer"
              checked={isChecked(permissionGroup)}
              onCheckedChange={(checked) => {
                toggleNames(checked as boolean, permissionGroup);
              }}
            />
            <AccordionTrigger className="justify-start gap-2 cursor-pointer hover:font-semibold hover:no-underline">
              <span>{permissionGroup.title}</span>
            </AccordionTrigger>
          </div>
          <AccordionContent>
            <SubPermissionGroupNodes
              subPermissionGroups={permissionGroup.children || []}
              toggleNames={toggleNames}
              isChecked={isChecked}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default MainPermissionGroups;

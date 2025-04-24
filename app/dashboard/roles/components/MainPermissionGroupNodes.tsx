"use client"

import { PermissionNode } from "@/app/types/global";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import SubPermissionGroupNodes from "./SubPermissionGroupNodes";

const MainPermissionGroups = ({
  permissionGroups,
  toggleKeys,
  isChecked,
}: {
  permissionGroups: PermissionNode[];
  toggleKeys: (checked: boolean, node?: PermissionNode) => void;
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
                toggleKeys(checked as boolean, permissionGroup);
              }}
            />
            <AccordionTrigger className="justify-start gap-2 cursor-pointer hover:font-semibold hover:no-underline">
              <span>{permissionGroup.name}</span>
            </AccordionTrigger>
          </div>
          <AccordionContent>
            <SubPermissionGroupNodes
              subPermissionGroups={permissionGroup.children || []}
              toggleKeys={toggleKeys}
              isChecked={isChecked}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default MainPermissionGroups;

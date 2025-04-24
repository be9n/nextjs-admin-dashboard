"use client";

import { Checkbox } from "@/components/ui/checkbox";

export type PermissionNode = {
  id: string;
  key: string;
  name: string;
  children?: PermissionNode[];
};

type Props = {
  node: PermissionNode;
  selected: string[];
  onToggle: (key: string, allKeys: string[]) => void;
};

export const PermissionSelector: React.FC<Props> = ({
  node,
  selected,
  onToggle,
}) => {
  const isChecked = selected.includes(node.key);

  const getAllKeys = (n: PermissionNode): string[] => [
    n.key,
    ...(n.children?.flatMap(getAllKeys) ?? []),
  ];

  const handleToggle = () => {
    const allKeys = getAllKeys(node);
    onToggle(node.key, allKeys);
  };

  return (
    <div className="ml-4 space-y-1">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={node.key}
          checked={isChecked}
          onCheckedChange={handleToggle}
        />
        <label htmlFor={node.key} className="text-sm font-medium leading-none">
          {node.name}
        </label>
      </div>

      {node.children?.map((child) => (
        <PermissionSelector
          key={child.key}
          node={child}
          selected={selected}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

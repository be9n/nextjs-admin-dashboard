import { PermissionNode } from "@/app/types/global";
import { useCallback } from "react";

/**
 * Custom hook to handle hierarchical permission selection logic
 */
export function usePermissionSelection(
  selectedPermissions: string[],
  permissionGroups: PermissionNode[] | undefined
) {
  /**
   * Get all permission names from a node and its children
   */
  const getAllNodeNames = useCallback((node: PermissionNode): string[] => {
    return [node.name, ...(node.children?.flatMap(getAllNodeNames) ?? [])];
  }, []);

  /**
   * Get all permission names from all groups
   */
  const getAllNames = useCallback(
    () => permissionGroups?.flatMap(getAllNodeNames),
    [permissionGroups, getAllNodeNames]
  );

  /**
   * Toggle permission selection state
   */
  const toggleNames = useCallback(
    (
      checked: boolean,
      node?: PermissionNode,
      onChange?: (value: string[]) => void
    ) => {
      const keys = node ? getAllNodeNames(node) : getAllNames();

      let updated = checked
        ? [...new Set([...selectedPermissions, ...(keys || [])])]
        : selectedPermissions.filter((k) => !(keys || []).includes(k));

      // Apply parent-child logic for the updated permissions
      const updateParentChildRelationships = (nodes: PermissionNode[]) => {
        for (const current of nodes) {
          if (current.children && current.children.length > 0) {
            // First process deeper levels
            updateParentChildRelationships(current.children);

            // Get all descendant permission names (excluding the current node)
            const descendantKeys = getAllNodeNames(current).filter(
              (k) => k !== current.name
            );

            // Check if all descendants are selected
            const someAreSelected = descendantKeys.some((key) =>
              updated.includes(key)
            );

            // Add parent if any descendants are selected, otherwise remove it
            if (someAreSelected) {
              if (!updated.includes(current.name)) {
                updated.push(current.name);
              }
            } else {
              updated = updated.filter((k) => k !== current.name);
            }
          }
        }
      };

      // Process parent-child relationships
      updateParentChildRelationships(permissionGroups || []);

      onChange?.(updated);
    },
    [selectedPermissions, getAllNodeNames, getAllNames, permissionGroups]
  );

  /**
   * Check if a node is selected
   */
  const isChecked = useCallback(
    (node?: PermissionNode): boolean => {
      if (!node) {
        // For "Select All" checkbox, check if all permission nodes are selected
        return (getAllNames() || []).every((key) =>
          selectedPermissions.includes(key)
        );
      }

      // For leaf nodes (no children), simply check if the node is selected
      if (!node.children || node.children.length === 0) {
        return selectedPermissions.includes(node.name);
      }

      // For parent nodes, check if all descendants are selected
      const descendantKeys = getAllNodeNames(node).filter(
        (k) => k !== node.name
      );
      return descendantKeys.every((key) => selectedPermissions.includes(key));
    },
    [selectedPermissions, getAllNames, getAllNodeNames]
  );

  return {
    getAllNodeNames,
    getAllNames,
    toggleNames,
    isChecked,
  };
}

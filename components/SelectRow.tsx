import { useCallback } from "react";
import { Checkbox } from "./ui/checkbox";

type SelectRowProps = {
  selectAll?: boolean;
  allRowIds?: number[] | undefined;
  rowId?: number;
  selectedRowIds: number[];
  setSelectedRowIds?: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function SelectRow({
  selectAll = false,
  allRowIds,
  rowId,
  selectedRowIds,
  setSelectedRowIds,
}: SelectRowProps) {
  const toggleSelected = useCallback(
    (rowId: number) => {
      if (!setSelectedRowIds) return;

      setSelectedRowIds((prev: number[]) => {
        if (prev.includes(rowId)) {
          return prev.filter((id: number) => id !== rowId);
        } else {
          return [...prev, rowId];
        }
      });
    },
    [setSelectedRowIds]
  );

  const toggleAll = useCallback(() => {
    if (!allRowIds || !setSelectedRowIds) return;

    setSelectedRowIds((prev) => {
      const allSelected = allRowIds.every((id) => prev.includes(id));

      if (allSelected) {
        // Remove allRowIds from selectedRowIds
        return prev.filter((id) => !allRowIds.includes(id));
      } else {
        // Add any missing ids from allRowIds to selectedRowIds
        const newIds = allRowIds.filter((id) => !prev.includes(id));
        return [...prev, ...newIds];
      }
    });
  }, [allRowIds, setSelectedRowIds]);

  if (selectAll) {
    return (
      <div className="flex justify-center items-center">
        <Checkbox
          checked={
            allRowIds?.every((item) => selectedRowIds.includes(item)) || false
          }
          onCheckedChange={() => toggleAll()}
          className="cursor-pointer"
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <Checkbox
        checked={!!rowId && selectedRowIds.includes(rowId)}
        onCheckedChange={() => rowId && toggleSelected(rowId)}
        className="cursor-pointer"
      />
    </div>
  );
}

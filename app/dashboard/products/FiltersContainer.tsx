import CategoryFilter from "@/components/CategoryFilter";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function FiltersContainer() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className="cursor-pointer">
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full sm:w-[400px]"
        side={"right"}
        align="start"
      >
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
          <CategoryFilter />
        </div>
      </PopoverContent>
    </Popover>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductFormSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <div className="flex gap-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-40" />
        </div>

        <Skeleton className="h-8 w-full" />
      </div>

      <div className="mt-8">
        <div className="flex gap-4 justify-end">
          <Skeleton className="h-8 w-25" />
          <Skeleton className="h-8 w-25" />
        </div>
      </div>
    </div>
  );
}

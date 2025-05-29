import { Skeleton } from "@/components/ui/skeleton";

export default function DiscountFormSkeleton() {
  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Skeleton className="h-8 w-full bg-gray-200" />
        <Skeleton className="h-8 w-full bg-gray-200" />
        <div className="flex gap-6">
          <Skeleton className="h-8 w-40 bg-gray-200" />
          <Skeleton className="h-8 w-40 bg-gray-200" />
        </div>

        <Skeleton className="h-8 w-full bg-gray-200" />
      </div>

      <div className="mt-8">
        <div className="flex gap-4 justify-end">
          <Skeleton className="h-8 w-25 bg-gray-200" />
          <Skeleton className="h-8 w-25 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

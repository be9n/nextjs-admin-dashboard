import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
      <div className="bg-white rounded-lg p-8 shadow max-w-md w-full">
        <AlertTriangleIcon className="mx-auto h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Role Not Found</h2>
        <p className="text-gray-600 mb-6">
          The role you are looking for does not exist or may have been deleted.
        </p>
        <Button asChild>
          <Link href="/dashboard/roles">Return to Roles List</Link>
        </Button>
      </div>
    </div>
  );
} 
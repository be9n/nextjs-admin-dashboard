"use client";

import { Loader2Icon } from "lucide-react";

type LoadingProps = {
  textLoading?: boolean;
};

export default function Loading({ textLoading = false }: LoadingProps) {
  if (textLoading) {
    return (
      <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
        <span className="font-bold text-xl animate-pulse">Loading...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
      <Loader2Icon className="size-14 animate-spin text-indigo-500" />
    </div>
  );
}

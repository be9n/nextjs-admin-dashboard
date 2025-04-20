"use client";

import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-screen bg-gray-100 text-black flex items-center justify-center">
      <Loader2Icon className="size-14 animate-spin text-indigo-500" />
    </div>
  );
}

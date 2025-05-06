"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../app/[locale]/context/AuthContext";
import Link from "next/link";

const accountLinks = [
  {
    to: "/dashboard/profile",
    title: "Profile",
  },
];

export default function ProfileNav() {
  const { user, logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="text-indigo-800 font-medium h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center cursor-pointer">
          {user?.name.charAt(0).toString().toUpperCase() || "U"}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 me-2">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        {accountLinks.map((link) => (
          <DropdownMenuItem asChild key={link.to}>
            <Link href={"/dashboard/profile"} className="cursor-pointer">
              Profile
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button className="w-full cursor-pointer" onClick={logout}>
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

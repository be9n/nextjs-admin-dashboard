"use client";

import { useAuth } from "@/app/[locale]/context/AuthContext";
import Loading from "@/components/Loading";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "./Header";
import AppSidebar from "./Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          <Header />
          <main className="mx-auto">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}

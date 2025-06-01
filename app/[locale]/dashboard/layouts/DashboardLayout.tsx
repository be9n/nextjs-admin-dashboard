"use client";

import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "./Header";
import AppSidebar from "./Sidebar";

export default function DashboardLayout({
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
        <div className="flex w-full">
          <AppSidebar />
          <main className="flex-1 overflow-x-auto">
            <Header />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

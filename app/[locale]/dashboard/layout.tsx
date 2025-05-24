"use client";

import { AuthProvider } from "../../../context/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  );
}

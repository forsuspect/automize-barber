"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthContext";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import styles from "@/app/admin/admin.module.css";

export function AdminShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return <Loader fullscreen />;
  if (!isAuthenticated) return null;

  return (
    <div className={styles.dashboardLayout}>
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className={styles.main}>
        <AdminHeader
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

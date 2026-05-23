"use client";

import { BarbersManager } from "@/components/admin/BarbersManager";
import { AdminShell } from "@/components/admin/AdminShell";

export default function BarbeirosPage() {
  return (
    <AdminShell title="Barbeiros">
      <BarbersManager />
    </AdminShell>
  );
}

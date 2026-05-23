"use client";

import { AppointmentsManager } from "@/components/admin/AppointmentsManager";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AgendamentosPage() {
  return (
    <AdminShell title="Agendamentos">
      <AppointmentsManager />
    </AdminShell>
  );
}

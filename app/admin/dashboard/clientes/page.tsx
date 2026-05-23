"use client";

import { ClientsManager } from "@/components/admin/ClientsManager";
import { AdminShell } from "@/components/admin/AdminShell";

export default function ClientesPage() {
  return (
    <AdminShell title="Clientes">
      <ClientsManager />
    </AdminShell>
  );
}

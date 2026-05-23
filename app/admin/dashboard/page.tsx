"use client";

import { Calendar, Clock, DollarSign, Users } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { MetricCard } from "@/components/admin/MetricCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useApp } from "@/context/AppContext";
import { formatCurrency, formatShortDate } from "@/utils/format";
import { countFreeSlotsToday } from "@/utils/schedule";
import styles from "@/app/admin/admin.module.css";
import panelStyles from "@/components/admin/Charts.module.css";

export default function DashboardPage() {
  const { clients, appointments, services, barbers } = useApp();
  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = appointments.filter((a) => a.date === today);
  const revenue = appointments
    .filter(
      (a) =>
        a.date === today &&
        (a.status === "confirmado" || a.status === "completado")
    )
    .reduce((sum, a) => sum + a.price, 0);

  const freeSlots = countFreeSlotsToday(
    barbers.filter((b) => b.active),
    services,
    appointments,
    today
  );

  const recentAppointments = [...appointments]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const recentClients = [...clients]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <AdminShell title="Dashboard">
      <div className={styles.metricsGrid}>
        <MetricCard
          label="Total de clientes"
          value={clients.length}
          icon={Users}
          trend="+12% este mês"
          index={0}
        />
        <MetricCard
          label="Agendamentos hoje"
          value={todayAppointments.length}
          icon={Calendar}
          index={1}
        />
        <MetricCard
          label="Faturamento hoje"
          value={formatCurrency(revenue)}
          icon={DollarSign}
          index={2}
        />
        <MetricCard
          label="Horários livres"
          value={freeSlots}
          icon={Clock}
          index={3}
        />
      </div>

      <div className={styles.chartsGrid}>
        <RevenueChart />
        <div className={panelStyles.panel}>
          <h3 className={panelStyles.panelTitle}>Calendário — Hoje</h3>
          <div className={panelStyles.list}>
            {todayAppointments.length === 0 ? (
              <p className={panelStyles.empty}>Nenhum agendamento hoje.</p>
            ) : (
              todayAppointments.map((apt) => (
                <div key={apt.id} className={panelStyles.listItem}>
                  <span>
                    {apt.time} — {apt.clientName}
                  </span>
                  <StatusBadge status={apt.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className={styles.panelsGrid}>
        <div className={panelStyles.panel}>
          <h3 className={panelStyles.panelTitle}>Agendamentos recentes</h3>
          <div className={panelStyles.list}>
            {recentAppointments.map((apt) => (
              <div key={apt.id} className={panelStyles.listItem}>
                <span>
                  {apt.clientName} — {formatShortDate(apt.date)} {apt.time}
                </span>
                <span>{formatCurrency(apt.price)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={panelStyles.panel}>
          <h3 className={panelStyles.panelTitle}>Clientes recentes</h3>
          <div className={panelStyles.list}>
            {recentClients.map((client) => (
              <div key={client.id} className={panelStyles.listItem}>
                <span>{client.name}</span>
                <span>{client.visitCount} visitas</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

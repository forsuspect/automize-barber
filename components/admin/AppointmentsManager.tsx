"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useApp } from "@/context/AppContext";
import type { Appointment, AppointmentStatus } from "@/types";
import { formatCurrency, formatShortDate } from "@/utils/format";
import { formatPhone } from "@/utils/phone";
import { getAvailableSlots } from "@/utils/schedule";
import { StatusBadge } from "./StatusBadge";
import { sendBookingConfirmationToClient } from "@/services/notificationService";
import styles from "./AppointmentsManager.module.css";

const formSchema = z.object({
  clientName: z.string().min(3),
  clientPhone: z.string().min(10),
  barberId: z.string().min(1),
  serviceId: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  status: z.enum(["pendente", "confirmado", "completado", "cancelado"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const STATUS_FILTERS: (AppointmentStatus | "all")[] = [
  "all",
  "pendente",
  "confirmado",
  "completado",
  "cancelado",

];

export function AppointmentsManager() {
  const {
    appointments,
    barbers,
    services,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  } = useApp();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(
    "all"
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const barberId = watch("barberId");
  const serviceId = watch("serviceId");
  const date = watch("date");

  const selectedBarber = barbers.find((b) => b.id === barberId);
  const selectedService = services.find((s) => s.id === serviceId);

  const slots = useMemo(() => {
    if (!selectedBarber || !selectedService || !date) return [];
    return getAvailableSlots(
      selectedBarber,
      date,
      selectedService.duration,
      appointments,
      editing?.id
    );
  }, [selectedBarber, selectedService, date, appointments, editing]);

  const filtered = useMemo(() => {
    return appointments
      .filter((a) => statusFilter === "all" || a.status === statusFilter)
      .filter(
        (a) =>
          !search ||
          a.clientName.toLowerCase().includes(search.toLowerCase()) ||
          a.barberName.toLowerCase().includes(search.toLowerCase()) ||
          a.serviceName.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));
  }, [appointments, statusFilter, search]);

  const openCreate = () => {
    setEditing(null);
    reset({
      clientName: "",
      clientPhone: "",
      barberId: "",
      serviceId: "",
      date: "",
      time: "",
      status: "pendente" as const,
      notes: "",
    });
    setModalOpen(true);
  };

  const openEdit = (apt: Appointment) => {
    setEditing(apt);
    reset({
      clientName: apt.clientName,
      clientPhone: apt.clientPhone,
      barberId: apt.barberId,
      serviceId: apt.serviceId,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      notes: apt.notes ?? "",
    });
    setModalOpen(true);
  };

  const onSubmit = (data: FormValues) => {
    const barber = barbers.find((b) => b.id === data.barberId)!;
    const service = services.find((s) => s.id === data.serviceId)!;

    if (editing) {
      updateAppointment(editing.id, {
        ...data,
        barberName: barber.name,
        serviceName: service.name,
        duration: service.duration,
        price: service.price,
      });
    } else {
      addAppointment(
        {
          clientName: data.clientName,
          clientPhone: data.clientPhone,
          barberId: data.barberId,
          barberName: barber.name,
          serviceId: data.serviceId,
          serviceName: service.name,
          date: data.date,
          time: data.time,
          duration: service.duration,
          price: service.price,
          notes: data.notes,
        },
        data.status
      );
    }
    setModalOpen(false);
  };

  const quickStatus = (id: string, status: AppointmentStatus) => {
    updateAppointment(id, { status });

    if (status === "confirmado") {
      const apt = appointments.find((a) => a.id === id);
      if (apt) {
        sendBookingConfirmationToClient({
          clientName: apt.clientName,
          clientPhone: apt.clientPhone,
          barberName: apt.barberName,
          serviceName: apt.serviceName,
          date: apt.date,
          time: apt.time,
          price: apt.price,
        }).then(({ message }) => {
          const phone = apt.clientPhone.replace(/\D/g, "");
          console.log("Mensagem gerada:", message);
          const url = `https://api.whatsapp.com/send?phone=55${phone}&text=${encodeURIComponent(message)}`;
          window.open(url, "_blank", "noopener,noreferrer");
        });
      }
    }
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Input
            placeholder="Buscar cliente, barbeiro ou serviço..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus size={16} /> Novo
        </Button>
      </div>

      <div className={styles.filters}>
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            className={`${styles.filterBtn} ${statusFilter === s ? styles.filterActive : ""}`}
            onClick={() => setStatusFilter(s)}
          >
            {s === "all" ? "Todos" : s}
          </button>
        ))}
      </div>

      <div className={styles.tableWrap} style={{ marginTop: "1.5rem" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Barbeiro</th>
              <th>Serviço</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((apt) => (
              <tr key={apt.id}>
                <td data-label="Cliente">
                  {apt.clientName}
                  <br />
                  <small style={{ color: "var(--color-gray-mid)" }}>
                    {apt.clientPhone}
                  </small>
                </td>
                <td data-label="Barbeiro">{apt.barberName}</td>
                <td data-label="Serviço">{apt.serviceName}</td>
                <td data-label="Data">{formatShortDate(apt.date)}</td>
                <td data-label="Horário">{apt.time}</td>
                <td data-label="Valor">{formatCurrency(apt.price)}</td>
                <td data-label="Status">
                  <StatusBadge status={apt.status} />
                </td>
                <td data-label="Ações">
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => openEdit(apt)}
                    >
                      Editar
                    </button>
                    {apt.status === "pendente" && (
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => quickStatus(apt.id, "confirmado")}
                      >
                        Confirmar
                      </button>
                    )}
                    {apt.status !== "cancelado" && (
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => quickStatus(apt.id, "cancelado")}
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => deleteAppointment(apt.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar agendamento" : "Novo agendamento"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>Salvar</Button>
          </>
        }
      >
        <div className={styles.formGrid}>
          <div className={styles.formRow}>
            <Input
              label="Cliente"
              error={errors.clientName?.message}
              {...register("clientName")}
            />
            <Input
              label="Telefone"
              error={errors.clientPhone?.message}
              {...register("clientPhone", {
                onChange: (e) =>
                  setValue("clientPhone", formatPhone(e.target.value)),
              })}
            />
          </div>
          <div className={styles.formRow}>
            <Select
              label="Barbeiro"
              options={[
                { value: "", label: "Selecione" },
                ...barbers.map((b) => ({ value: b.id, label: b.name })),
              ]}
              {...register("barberId")}
            />
            <Select
              label="Serviço"
              options={[
                { value: "", label: "Selecione" },
                ...services.map((s) => ({ value: s.id, label: s.name })),
              ]}
              {...register("serviceId")}
            />
          </div>
          <div className={styles.formRow}>
            <Input label="Data" type="date" {...register("date")} />
            <Select
              label="Horário"
              options={[
                { value: "", label: "Selecione" },
                ...slots.map((s) => ({ value: s, label: s })),
                ...(editing && watch("time") && !slots.includes(watch("time"))
                  ? [{ value: watch("time"), label: watch("time") }]
                  : []),
              ]}
              {...register("time")}
            />
          </div>
          <Select
            label="Status"
            options={[
              { value: "pendente", label: "Pendente" },
              { value: "confirmado", label: "Confirmado" },
              { value: "completado", label: "Concluído" },
              { value: "cancelado", label: "Cancelado" },
            ]}
            {...register("status")}
          />
          <Input label="Observações" {...register("notes")} />
        </div>
      </Modal>
    </div>
  );
}

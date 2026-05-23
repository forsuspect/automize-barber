"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useApp } from "@/context/AppContext";
import type { Barber } from "@/types";
import styles from "./AppointmentsManager.module.css";

const DAYS = [
  { value: 0, label: "Dom" },
  { value: 1, label: "Seg" },
  { value: 2, label: "Ter" },
  { value: 3, label: "Qua" },
  { value: 4, label: "Qui" },
  { value: 5, label: "Sex" },
  { value: 6, label: "Sáb" },
];

const schema = z.object({
  name: z.string().min(2),
  specialty: z.string().min(2),
  photo: z.string().min(1, "Insira a foto ou envie um arquivo"),
  instagram: z.string().optional(),
  workStart: z.string(),
  workEnd: z.string(),
  active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function BarbersManager() {
  const { barbers, addBarber, updateBarber, deleteBarber } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Barber | null>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [fileName, setFileName] = useState<string>("");

  const { register, handleSubmit, reset, setValue, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { active: true, workStart: "09:00", workEnd: "21:00" },
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue("photo", base64String, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setSelectedDays([1, 2, 3, 4, 5, 6]);
    setFileName("");
    reset({
      name: "",
      specialty: "",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
      instagram: "",
      workStart: "09:00",
      workEnd: "21:00",
      active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (barber: Barber) => {
    setEditing(barber);
    setSelectedDays(barber.availableDays);
    setFileName(barber.photo.startsWith("data:") ? "Imagem já enviada" : "");
    reset({
      name: barber.name,
      specialty: barber.specialty,
      photo: barber.photo,
      instagram: barber.instagram ?? "",
      workStart: barber.workStart,
      workEnd: barber.workEnd,
      active: barber.active,
    });
    setModalOpen(true);
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      availableDays: selectedDays,
      rating: editing?.rating ?? 5,
      reviewCount: editing?.reviewCount ?? 0,
    };
    if (editing) {
      updateBarber(editing.id, payload);
    } else {
      addBarber(payload);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <Button size="sm" onClick={openCreate}>
          <Plus size={16} /> Novo barbeiro
        </Button>
      </div>

      <div className={styles.tableWrap} style={{ marginTop: "1.5rem" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Especialidade</th>
              <th>Horário</th>
              <th>Dias</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {barbers.map((barber) => (
              <tr key={barber.id}>
                <td>{barber.name}</td>
                <td>{barber.specialty}</td>
                <td>
                  {barber.workStart} — {barber.workEnd}
                </td>
                <td>
                  {barber.availableDays
                    .map((d) => DAYS.find((x) => x.value === d)?.label)
                    .join(", ")}
                </td>
                <td>{barber.active ? "Ativo" : "Inativo"}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => openEdit(barber)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => deleteBarber(barber.id)}
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
        title={editing ? "Editar barbeiro" : "Novo barbeiro"}
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
          <Input label="Nome" error={errors.name?.message} {...register("name")} />
          <Input
            label="Especialidade"
            error={errors.specialty?.message}
            {...register("specialty")}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <p style={{ fontSize: "0.8125rem", color: "var(--color-gray-light)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>
              Foto do Barbeiro
            </p>
            <div style={{ position: "relative", width: "100%" }}>
              <label
                htmlFor="barber-photo-upload"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1.5rem",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: fileName ? "2px dashed var(--color-gold)" : "2px dashed var(--glass-border)",
                  borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                  transition: "all var(--transition-base)",
                  textAlign: "center",
                  gap: "0.5rem",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={fileName ? "var(--color-white)" : "var(--color-gold)"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ opacity: 0.8 }}
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span style={{ fontSize: "0.875rem", color: "var(--color-white)", fontWeight: 500 }}>
                  {fileName ? "Alterar imagem" : "Selecionar Imagem"}
                </span>
                <span style={{ fontSize: "0.75rem", color: fileName ? "var(--color-gold)" : "var(--color-gray-mid)" }}>
                  {fileName ? `✓ ${fileName}` : "PNG, JPG ou GIF (máx. 2MB)"}
                </span>
              </label>
              <input
                id="barber-photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                }}
              />
            </div>
            <input type="hidden" {...register("photo")} />
            {errors.photo?.message && (
              <span style={{ fontSize: "0.75rem", color: "#f87171", marginTop: "0.25rem" }}>
                {errors.photo.message}
              </span>
            )}
          </div>
          <Input label="Instagram" {...register("instagram")} />
          <div className={styles.formRow}>
            <Input label="Início" type="time" {...register("workStart")} />
            <Input label="Fim" type="time" {...register("workEnd")} />
          </div>
          <div>
            <p style={{ fontSize: "0.8125rem", color: "var(--color-gray-light)", marginBottom: "0.5rem" }}>
              DIAS DISPONÍVEIS
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {DAYS.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  className={`${styles.filterBtn} ${selectedDays.includes(day.value) ? styles.filterActive : ""}`}
                  onClick={() => toggleDay(day.value)}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
            <input type="checkbox" {...register("active")} />
            Barbeiro ativo
          </label>
        </div>
      </Modal>
    </div>
  );
}

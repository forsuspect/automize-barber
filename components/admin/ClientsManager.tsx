"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useApp } from "@/context/AppContext";
import type { Client } from "@/types";
import { formatPhone, isValidPhone } from "@/utils/phone";
import styles from "./AppointmentsManager.module.css";

const schema = z.object({
  name: z.string().min(3),
  phone: z.string().refine(isValidPhone, "Telefone inválido"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ClientsManager() {
  const { clients, addClient, updateClient, deleteClient } = useApp();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  const filtered = useMemo(
    () =>
      clients.filter(
        (c) =>
          !search ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search)
      ),
    [clients, search]
  );

  const openCreate = () => {
    setEditing(null);
    reset({ name: "", phone: "", notes: "" });
    setModalOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditing(client);
    reset({ name: client.name, phone: client.phone, notes: client.notes ?? "" });
    setModalOpen(true);
  };

  const onSubmit = (data: FormValues) => {
    if (editing) {
      updateClient(editing.id, data);
    } else {
      addClient(data);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Input
            placeholder="Buscar por nome ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus size={16} /> Novo cliente
        </Button>
      </div>

      <div className={styles.tableWrap} style={{ marginTop: "1.5rem" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Visitas</th>
              <th>Últimos serviços</th>
              <th>Observações</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((client) => (
              <tr key={client.id}>
                <td data-label="Nome">{client.name}</td>
                <td data-label="Telefone">{client.phone}</td>
                <td data-label="Visitas">{client.visitCount}</td>
                <td data-label="Serviços">
                  {client.lastServices.length > 0
                    ? client.lastServices.join(", ")
                    : "—"}
                </td>
                <td data-label="Obs.">{client.notes ?? "—"}</td>
                <td data-label="Ações">
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => openEdit(client)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => deleteClient(client.id)}
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
        title={editing ? "Editar cliente" : "Novo cliente"}
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
            label="Telefone"
            error={errors.phone?.message}
            {...register("phone", {
              onChange: (e) => setValue("phone", formatPhone(e.target.value)),
            })}
          />
          <Textarea label="Observações" {...register("notes")} />
        </div>
      </Modal>
    </div>
  );
}

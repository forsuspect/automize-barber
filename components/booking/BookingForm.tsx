"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ConfirmationMessage } from "@/components/booking/ConfirmationMessage";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useApp } from "@/context/AppContext";
import { sendBookingConfirmationToClient } from "@/services/notificationService";
import { formatCurrency, formatDate } from "@/utils/format";
import { buildClientConfirmationMessage } from "@/utils/messages";
import { formatPhone, isValidPhone } from "@/utils/phone";
import { getAvailableSlots } from "@/utils/schedule";
import styles from "./BookingForm.module.css";

const schema = z.object({
  barberId: z.string().min(1, "Selecione um barbeiro"),
  serviceId: z.string().min(1, "Selecione um serviço"),
  date: z.string().min(1, "Selecione uma data"),
  time: z.string().min(1, "Selecione um horário"),
  clientName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  clientPhone: z
    .string()
    .refine(isValidPhone, "Telefone inválido"),
});

type FormData = z.infer<typeof schema>;

export function BookingForm() {
  const { barbers, services, appointments, addAppointment, loaded } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preBarber = searchParams.get("barbeiro") ?? "";

  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [messageDelivered, setMessageDelivered] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [summary, setSummary] = useState<FormData | null>(null);

  const activeBarbers = barbers.filter((b) => b.active);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      barberId: preBarber,
      serviceId: "",
      date: "",
      time: "",
      clientName: "",
      clientPhone: "",
    },
  });

  const barberId = watch("barberId");
  const serviceId = watch("serviceId");
  const date = watch("date");
  const time = watch("time");
  const clientPhone = watch("clientPhone");

  const selectedBarber = barbers.find((b) => b.id === barberId);
  const selectedService = services.find((s) => s.id === serviceId);

  const availableSlots = useMemo(() => {
    if (!selectedBarber || !selectedService || !date) return [];
    return getAvailableSlots(
      selectedBarber,
      date,
      selectedService.duration,
      appointments
    );
  }, [selectedBarber, selectedService, date, appointments]);

  useEffect(() => {
    if (preBarber) setValue("barberId", preBarber);
  }, [preBarber, setValue]);

  useEffect(() => {
    setValue("time", "");
  }, [barberId, serviceId, date, setValue]);

  useEffect(() => {
    if (confirmed) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [confirmed, router]);

  const minDate = new Date().toISOString().split("T")[0];
  const step = !barberId ? 1 : !serviceId ? 2 : !date || !time ? 3 : 4;

  const onSubmit = async (data: FormData) => {
    setSummary(data);
    setShowModal(true);
  };

  const confirmBooking = async () => {
    if (!summary || !selectedBarber || !selectedService) return;
    setSubmitting(true);

    addAppointment({
      clientName: summary.clientName,
      clientPhone: summary.clientPhone,
      barberId: summary.barberId,
      barberName: selectedBarber.name,
      serviceId: summary.serviceId,
      serviceName: selectedService.name,
      date: summary.date,
      time: summary.time,
      duration: selectedService.duration,
      price: selectedService.price,
    });

    const messagePayload = {
      clientName: summary.clientName,
      clientPhone: summary.clientPhone,
      barberName: selectedBarber.name,
      serviceName: selectedService.name,
      date: summary.date,
      time: summary.time,
      price: selectedService.price,
    };

    const confirmationMsg = buildClientConfirmationMessage(messagePayload);
    setConfirmationText(confirmationMsg);
    setSubmitting(false);
    setShowModal(false);
    setConfirmed(true);
    setMessageDelivered(true);
  };

  if (!loaded) return null;

  if (confirmed && summary && selectedBarber && selectedService) {
    return (
      <div className={styles.page}>
        <motion.div
          className={styles.container}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className={`${styles.form} ${styles.success}`}>
            <CheckCircle2 className={styles.successIcon} size={64} />
            <h2 className={styles.title}>Agendamento confirmado!</h2>
            <p className={styles.subtitle}>
              {summary.clientName}, você receberá a confirmação no WhatsApp
              cadastrado.
            </p>

            <ConfirmationMessage
              clientPhone={summary.clientPhone}
              delivered={messageDelivered}
            />

            <Link href="/">
              <Button fullWidth size="lg">
                Voltar ao início
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Agendar horário</h1>
          <p className={styles.subtitle}>
            Escolha barbeiro, serviço, data e horário em poucos passos.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.steps}>
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`${styles.step} ${step >= s ? styles.stepActive : ""}`}
              />
            ))}
          </div>

          <Select
            label="Barbeiro"
            options={[
              { value: "", label: "Selecione..." },
              ...activeBarbers.map((b) => ({
                value: b.id,
                label: b.name,
              })),
            ]}
            error={errors.barberId?.message}
            {...register("barberId")}
          />

          <Select
            label="Serviço"
            options={[
              { value: "", label: "Selecione..." },
              ...services.map((s) => ({
                value: s.id,
                label: `${s.name} — ${formatCurrency(s.price)} (${s.duration}min)`,
              })),
            ]}
            error={errors.serviceId?.message}
            {...register("serviceId")}
          />

          <div className={styles.row}>
            <Input
              label="Data"
              type="date"
              min={minDate}
              error={errors.date?.message}
              {...register("date")}
            />
          </div>

          <div>
            <label className="sr-only">Horário disponível</label>
            {date && barberId && serviceId ? (
              availableSlots.length > 0 ? (
                <div className={styles.slots}>
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`${styles.slot} ${time === slot ? styles.slotSelected : ""}`}
                      onClick={() =>
                        setValue("time", slot, { shouldValidate: true })
                      }
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className={styles.emptySlots}>
                  Nenhum horário disponível nesta data. Tente outra data.
                </p>
              )
            ) : (
              <p className={styles.emptySlots}>
                Selecione barbeiro, serviço e data para ver horários.
              </p>
            )}
            {errors.time ? (
              <span className={styles.errorText}>{errors.time.message}</span>
            ) : null}
            <input type="hidden" {...register("time")} />
          </div>

          <div className={styles.row}>
            <Input
              label="Seu nome"
              placeholder="Nome completo"
              error={errors.clientName?.message}
              {...register("clientName")}
            />
            <Input
              label="Telefone (WhatsApp)"
              placeholder="(11) 99999-9999"
              value={clientPhone}
              onChange={(e) =>
                setValue("clientPhone", formatPhone(e.target.value), {
                  shouldValidate: true,
                })
              }
              error={errors.clientPhone?.message}
            />
          </div>

          {selectedService && selectedBarber && date && time ? (
            <div className={styles.summary}>
              <h4>Resumo</h4>
              <p>
                {selectedService.name} com {selectedBarber.name}
              </p>
              <p>
                {formatDate(date)} às {time}
              </p>
              <p>{formatCurrency(selectedService.price)}</p>
            </div>
          ) : null}

          <Button type="submit" fullWidth size="lg">
            Confirmar agendamento
          </Button>
        </form>
      </div>

      <Modal
        open={showModal}
        onClose={() => !submitting && setShowModal(false)}
        title="Confirmar agendamento"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setShowModal(false)}
              disabled={submitting}
            >
              Voltar
            </Button>
            <Button loading={submitting} onClick={confirmBooking}>
              Confirmar
            </Button>
          </>
        }
      >
        {summary && selectedBarber && selectedService ? (
          <div className={styles.summary}>
            <p>
              <strong>Cliente:</strong> {summary.clientName}
            </p>
            <p>
              <strong>WhatsApp:</strong> {summary.clientPhone}
            </p>
            <p>
              <strong>Barbeiro:</strong> {selectedBarber.name}
            </p>
            <p>
              <strong>Serviço:</strong> {selectedService.name}
            </p>
            <p>
              <strong>Data:</strong> {formatDate(summary.date)} às {summary.time}
            </p>
            <p>
              <strong>Valor:</strong> {formatCurrency(selectedService.price)}
            </p>
            <p className={styles.modalNote}>
              Após confirmar, enviaremos a confirmação para o seu WhatsApp.
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

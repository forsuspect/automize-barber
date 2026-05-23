import { BRAND } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/utils/format";

export interface BookingMessagePayload {
  clientName: string;
  clientPhone: string;
  barberName: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
}

/** Mensagem que a barbearia envia ao cliente após confirmar o agendamento */
export function buildClientConfirmationMessage(
  data: BookingMessagePayload
): string {
  const firstName = data.clientName.split(" ")[0];


  const ePeace = String.fromCodePoint(0x270c, 0xfe0f);
  const eScissors = String.fromCodePoint(0x2702, 0xfe0f);
  const eBarber = String.fromCodePoint(0x1f488);
  const eCalendar = String.fromCodePoint(0x1f4c5);
  const eClock = String.fromCodePoint(0x23f0);
  const eCard = String.fromCodePoint(0x1f4b3);
  const ePin = String.fromCodePoint(0x1f4cd);

  return [
    `Olá, ${firstName}! ${ePeace}`,
    "",
    `Seu agendamento na *${BRAND.name}* foi confirmado com sucesso.`,
    "",
    `${eScissors} *Serviço:* ${data.serviceName}`,
    `${eBarber} *Barbeiro:* ${data.barberName}`,
    `${eCalendar} *Data:* ${formatDate(data.date)}`,
    `${eClock} *Horário:* ${data.time}`,
    `${eCard} *Valor:* ${formatCurrency(data.price)}`,
    "",
    `${ePin} ${BRAND.address}`,
    "",
    "Chegue com 10 minutos de antecedência. Qualquer dúvida, estamos à disposição!",
    "",
    `— Equipe ${BRAND.name}`,
  ].join("\n");
}

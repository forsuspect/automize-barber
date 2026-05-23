import { buildClientConfirmationMessage } from "@/utils/messages";
import type { BookingMessagePayload } from "@/utils/messages";
import { phoneDigits } from "@/utils/phone";
import { getStorageItem, setStorageItem } from "@/utils/storage";

const NOTIFICATIONS_KEY = "automize_barber_notifications";

export interface SentNotification {
  id: string;
  phone: string;
  message: string;
  sentAt: string;
  status: "sent" | "failed";
}

function saveNotification(entry: SentNotification): void {
  const list = getStorageItem<SentNotification[]>(NOTIFICATIONS_KEY) ?? [];
  setStorageItem(NOTIFICATIONS_KEY, [entry, ...list].slice(0, 100));
}

/**
 * Envia confirmação ao cliente (WhatsApp).
 * Hoje: registra localmente + webhook opcional.
 * Futuro: integrar WhatsApp Business API / Supabase Edge Function.
 */
export async function sendBookingConfirmationToClient(
  payload: BookingMessagePayload
): Promise<{ ok: boolean; message: string }> {
  const message = buildClientConfirmationMessage(payload);
  const phone = phoneDigits(payload.clientPhone);

  const entry: SentNotification = {
    id: `notif-${Date.now()}`,
    phone,
    message,
    sentAt: new Date().toISOString(),
    status: "sent",
  };

  const webhook = process.env.NEXT_PUBLIC_BOOKING_WEBHOOK_URL;

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          message,
          type: "booking_confirmation",
          payload,
        }),
      });
      if (!res.ok) throw new Error("Webhook falhou");
    } catch {
      entry.status = "failed";
      saveNotification(entry);
      return { ok: false, message };
    }
  }

  saveNotification(entry);

  // Simula tempo de envio (API real substituiria este delay)
  await new Promise((r) => setTimeout(r, 1500));

  return { ok: true, message };
}

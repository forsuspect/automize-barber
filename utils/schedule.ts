import { SLOT_INTERVAL } from "@/lib/constants";
import type { Appointment, Barber } from "@/types";

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function generateTimeSlots(start: string, end: string): string[] {
  const slots: string[] = [];
  let current = timeToMinutes(start);
  const endMin = timeToMinutes(end);
  while (current < endMin) {
    slots.push(minutesToTime(current));
    current += SLOT_INTERVAL;
  }
  return slots;
}

export function isSlotAvailable(
  barberId: string,
  date: string,
  time: string,
  duration: number,
  appointments: Appointment[],
  excludeId?: string
): boolean {
  const start = timeToMinutes(time);
  const end = start + duration;

  const dayAppointments = appointments.filter(
    (a) =>
      a.barberId === barberId &&
      a.date === date &&
      a.status !== "cancelado" &&
      a.id !== excludeId
  );

  return !dayAppointments.some((apt) => {
    const aptStart = timeToMinutes(apt.time);
    const aptEnd = aptStart + apt.duration;
    return start < aptEnd && end > aptStart;
  });
}

export function getAvailableSlots(
  barber: Barber,
  date: string,
  duration: number,
  appointments: Appointment[],
  excludeId?: string
): string[] {
  const dayOfWeek = new Date(date + "T12:00:00").getDay();
  if (!barber.availableDays.includes(dayOfWeek)) return [];

  const allSlots = generateTimeSlots(barber.workStart, barber.workEnd);
  return allSlots.filter((slot) => {
    const slotEnd = timeToMinutes(slot) + duration;
    if (slotEnd > timeToMinutes(barber.workEnd)) return false;
    return isSlotAvailable(
      barber.id,
      date,
      slot,
      duration,
      appointments,
      excludeId
    );
  });
}

export function countFreeSlotsToday(
  barbers: Barber[],
  services: { duration: number }[],
  appointments: Appointment[],
  date: string
): number {
  const defaultDuration = services[0]?.duration ?? 45;
  return barbers.reduce((total, barber) => {
    if (!barber.active) return total;
    const slots = getAvailableSlots(
      barber,
      date,
      defaultDuration,
      appointments
    );
    return total + slots.length;
  }, 0);
}

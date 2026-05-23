"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loadAppData, saveAppData } from "@/services/storageService";
import type {
  AppData,
  Appointment,
  AppointmentStatus,
  Barber,
  Client,
  Service,
} from "@/types";
import { generateId } from "@/utils/format";
import { phoneDigits } from "@/utils/phone";

interface AppContextValue extends AppData {
  loaded: boolean;
  addAppointment: (
    data: Omit<Appointment, "id" | "createdAt" | "status" | "clientId">,
    status?: AppointmentStatus
  ) => Appointment;
  updateAppointment: (id: string, patch: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  upsertClient: (name: string, phone: string, notes?: string) => Client;
  addClient: (client: Omit<Client, "id" | "createdAt" | "visitCount" | "lastServices">) => Client;
  updateClient: (id: string, patch: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addBarber: (barber: Omit<Barber, "id">) => Barber;
  updateBarber: (id: string, patch: Partial<Barber>) => void;
  deleteBarber: (id: string) => void;
  addService: (service: Omit<Service, "id">) => Service;
  updateService: (id: string, patch: Partial<Service>) => void;
  refresh: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setData(loadAppData());
    setLoaded(true);
  }, []);

  const persist = useCallback((next: AppData) => {
    setData(next);
    saveAppData(next);
  }, []);

  const refresh = useCallback(() => {
    setData(loadAppData());
  }, []);

  const upsertClient = useCallback(
    (name: string, phone: string, notes?: string): Client => {
      if (!data) throw new Error("Data not loaded");
      const digits = phoneDigits(phone);
      const existing = data.clients.find(
        (c) => phoneDigits(c.phone) === digits
      );
      if (existing) {
        const updated: Client = {
          ...existing,
          name,
          notes: notes ?? existing.notes,
          visitCount: existing.visitCount + 1,
        };
        persist({
          ...data,
          clients: data.clients.map((c) =>
            c.id === existing.id ? updated : c
          ),
        });
        return updated;
      }
      const client: Client = {
        id: generateId("cli"),
        name,
        phone,
        notes,
        visitCount: 1,
        lastServices: [],
        createdAt: new Date().toISOString(),
      };
      persist({ ...data, clients: [...data.clients, client] });
      return client;
    },
    [data, persist]
  );

  const addAppointment = useCallback(
    (
      apt: Omit<Appointment, "id" | "createdAt" | "status" | "clientId">,
      status: AppointmentStatus = "pendente"
    ): Appointment => {
      if (!data) throw new Error("Data not loaded");
      const client = upsertClient(apt.clientName, apt.clientPhone);
      const appointment: Appointment = {
        ...apt,
        id: generateId("apt"),
        clientId: client.id,
        status,
        createdAt: new Date().toISOString(),
      };
      const clients = data.clients.map((c) => {
        if (c.id !== client.id) return c;
        return {
          ...c,
          lastServices: [apt.serviceName, ...c.lastServices].slice(0, 5),
        };
      });
      persist({
        ...data,
        clients,
        appointments: [...data.appointments, appointment],
      });
      return appointment;
    },
    [data, persist, upsertClient]
  );

  const updateAppointment = useCallback(
    (id: string, patch: Partial<Appointment>) => {
      if (!data) return;
      persist({
        ...data,
        appointments: data.appointments.map((a) =>
          a.id === id ? { ...a, ...patch } : a
        ),
      });
    },
    [data, persist]
  );

  const deleteAppointment = useCallback(
    (id: string) => {
      if (!data) return;
      persist({
        ...data,
        appointments: data.appointments.filter((a) => a.id !== id),
      });
    },
    [data, persist]
  );

  const addClient = useCallback(
    (
      client: Omit<Client, "id" | "createdAt" | "visitCount" | "lastServices">
    ): Client => {
      if (!data) throw new Error("Data not loaded");
      const newClient: Client = {
        ...client,
        id: generateId("cli"),
        visitCount: 0,
        lastServices: [],
        createdAt: new Date().toISOString(),
      };
      persist({ ...data, clients: [...data.clients, newClient] });
      return newClient;
    },
    [data, persist]
  );

  const updateClient = useCallback(
    (id: string, patch: Partial<Client>) => {
      if (!data) return;
      persist({
        ...data,
        clients: data.clients.map((c) =>
          c.id === id ? { ...c, ...patch } : c
        ),
      });
    },
    [data, persist]
  );

  const deleteClient = useCallback(
    (id: string) => {
      if (!data) return;
      persist({
        ...data,
        clients: data.clients.filter((c) => c.id !== id),
      });
    },
    [data, persist]
  );

  const addBarber = useCallback(
    (barber: Omit<Barber, "id">): Barber => {
      if (!data) throw new Error("Data not loaded");
      const newBarber: Barber = { ...barber, id: generateId("barb") };
      persist({ ...data, barbers: [...data.barbers, newBarber] });
      return newBarber;
    },
    [data, persist]
  );

  const updateBarber = useCallback(
    (id: string, patch: Partial<Barber>) => {
      if (!data) return;
      persist({
        ...data,
        barbers: data.barbers.map((b) =>
          b.id === id ? { ...b, ...patch } : b
        ),
      });
    },
    [data, persist]
  );

  const deleteBarber = useCallback(
    (id: string) => {
      if (!data) return;
      persist({
        ...data,
        barbers: data.barbers.filter((b) => b.id !== id),
      });
    },
    [data, persist]
  );

  const addService = useCallback(
    (service: Omit<Service, "id">): Service => {
      if (!data) throw new Error("Data not loaded");
      const newService: Service = { ...service, id: generateId("svc") };
      persist({ ...data, services: [...data.services, newService] });
      return newService;
    },
    [data, persist]
  );

  const updateService = useCallback(
    (id: string, patch: Partial<Service>) => {
      if (!data) return;
      persist({
        ...data,
        services: data.services.map((s) =>
          s.id === id ? { ...s, ...patch } : s
        ),
      });
    },
    [data, persist]
  );

  const value = useMemo<AppContextValue | null>(() => {
    if (!data) return null;
    return {
      ...data,
      loaded,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      upsertClient,
      addClient,
      updateClient,
      deleteClient,
      addBarber,
      updateBarber,
      deleteBarber,
      addService,
      updateService,
      refresh,
    };
  }, [
    data,
    loaded,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    upsertClient,
    addClient,
    updateClient,
    deleteClient,
    addBarber,
    updateBarber,
    deleteBarber,
    addService,
    updateService,
    refresh,
  ]);

  if (!value) {
    return null;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export type { AppointmentStatus };

export type AppointmentStatus =
  | "pendente"
  | "confirmado"
  | "completado"
  | "cancelado";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  icon: string;
}

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  rating: number;
  reviewCount: number;
  instagram?: string;
  availableDays: number[];
  workStart: string;
  workEnd: string;
  active: boolean;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  notes?: string;
  visitCount: number;
  lastServices: string[];
  createdAt: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  barberId: string;
  barberName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  comment: string;
  rating: number;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  height: number;
}

export interface AdminUser {
  username: string;
  password: string;
}

export interface DashboardMetrics {
  totalClients: number;
  todayAppointments: number;
  revenue: number;
  freeSlots: number;
}

export interface AppData {
  services: Service[];
  barbers: Barber[];
  clients: Client[];
  appointments: Appointment[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
}

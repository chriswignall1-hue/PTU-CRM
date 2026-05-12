export type ServiceId = 'boiler_service' | 'gas_safety' | 'boiler_repair' | 'boiler_installation';

export interface Service {
  id: ServiceId;
  booklyId: number;
  name: string;
  description: string;
  duration: number;   // minutes
  price: string;
  icon: string;
}

export interface TimeSlot {
  time: string;       // "HH:MM"
  available: boolean;
  staffId?: number;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  notes: string;
}

export interface BookingPayload {
  serviceId: number;
  staffId?: number;
  date: string;       // "YYYY-MM-DD"
  time: string;       // "HH:MM"
  customer: CustomerDetails;
}

export interface BookingConfirmation {
  id: number;
  reference: string;
  service: string;
  date: string;
  time: string;
  customerName: string;
}

export interface BookingState {
  service: Service | null;
  date: string | null;
  timeSlot: TimeSlot | null;
  customer: CustomerDetails | null;
}

// React Navigation types
export type RootStackParamList = {
  Home: undefined;
  ServiceSelection: undefined;
  DatePicker: {service: Service};
  TimeSlot: {service: Service; date: string};
  CustomerDetails: {service: Service; date: string; timeSlot: TimeSlot};
  BookingSummary: {
    service: Service;
    date: string;
    timeSlot: TimeSlot;
    customer: CustomerDetails;
  };
  Confirmation: {confirmation: BookingConfirmation};
};

// Bookly API response shapes
export interface BooklyService {
  id: number;
  title: string;
  duration: number;
  price: string;
}

export interface BooklySlot {
  start: string;
  end: string;
  staff_id: number;
}

export interface BooklyAppointmentResponse {
  appointment_id: number;
  token: string;
}

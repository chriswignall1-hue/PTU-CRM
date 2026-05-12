/**
 * Bookly REST API integration layer.
 *
 * Requires these addons installed on the WordPress site:
 *   - "Bookly Read Rest API" (CodeCanyon) for GET endpoints
 *   - "Bookly CRED Rest API Operations" (CodeCanyon) for POST/create
 *
 * While USE_MOCK_API=true in constants.ts, all calls return local mock data
 * so you can develop and demo the app before the addons are purchased.
 *
 * Authentication: add your WP Application Password as an Authorization header
 * once the addons are installed (see README.md for setup steps).
 */

import axios from 'axios';
import {
  BookingPayload,
  BookingConfirmation,
  BooklySlot,
} from '../types';
import {
  BOOKLY_API_BASE,
  BOOKLY_CRED_API_BASE,
  DEFAULT_STAFF_ID,
  USE_MOCK_API,
} from '../utils/constants';

// ---------------------------------------------------------------------------
// Axios instance — set Authorization header after addon install
// ---------------------------------------------------------------------------
const api = axios.create({
  baseURL: BOOKLY_API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': 'Basic ' + btoa('wp_username:application_password'),
  },
});

// ---------------------------------------------------------------------------
// Mock data (used when USE_MOCK_API = true)
// ---------------------------------------------------------------------------

function mockAvailableDates(year: number, month: number): string[] {
  const days: string[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    // Exclude weekends and past dates
    if (date >= today && date.getDay() !== 0 && date.getDay() !== 6) {
      days.push(`${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    }
  }
  return days;
}

function mockTimeSlots(date: string): BooklySlot[] {
  const slots: BooklySlot[] = [];
  const hours = [8, 9, 10, 11, 13, 14, 15, 16];
  // Simulate some slots being taken
  const takenHours = [10, 14];
  for (const h of hours) {
    if (!takenHours.includes(h)) {
      slots.push({
        start: `${date} ${String(h).padStart(2, '0')}:00:00`,
        end: `${date} ${String(h + 1).padStart(2, '0')}:00:00`,
        staff_id: DEFAULT_STAFF_ID,
      });
    }
  }
  return slots;
}

// ---------------------------------------------------------------------------
// Public API functions
// ---------------------------------------------------------------------------

/**
 * Returns dates that have at least one available slot for the given service
 * in the given year/month.
 */
export async function getAvailableDates(
  serviceBooklyId: number,
  year: number,
  month: number,
): Promise<string[]> {
  if (USE_MOCK_API) {
    return new Promise(resolve =>
      setTimeout(() => resolve(mockAvailableDates(year, month)), 600),
    );
  }

  const response = await api.get('/appointments/available_days', {
    params: {
      service_id: serviceBooklyId,
      staff_id: DEFAULT_STAFF_ID,
      year,
      month,
    },
  });
  // Bookly returns { "days": ["2024-06-01", ...] }
  return response.data.days as string[];
}

/**
 * Returns available time slots for a specific date and service.
 */
export async function getAvailableTimeSlots(
  serviceBooklyId: number,
  date: string,
): Promise<BooklySlot[]> {
  if (USE_MOCK_API) {
    return new Promise(resolve =>
      setTimeout(() => resolve(mockTimeSlots(date)), 600),
    );
  }

  const response = await api.get('/appointments/available_times', {
    params: {
      service_id: serviceBooklyId,
      staff_id: DEFAULT_STAFF_ID,
      date,
    },
  });
  return response.data.slots as BooklySlot[];
}

/**
 * Creates a new appointment in Bookly (writes to same DB as website).
 * Google Calendar sync happens automatically on the WordPress side.
 */
export async function createAppointment(
  payload: BookingPayload,
): Promise<BookingConfirmation> {
  if (USE_MOCK_API) {
    return new Promise(resolve =>
      setTimeout(
        () =>
          resolve({
            id: Math.floor(Math.random() * 9000) + 1000,
            reference: `SG-${Date.now().toString().slice(-6)}`,
            service: 'Mock Service',
            date: payload.date,
            time: payload.time,
            customerName: `${payload.customer.firstName} ${payload.customer.lastName}`,
          }),
        1200,
      ),
    );
  }

  // POST to the CRED addon endpoint
  const credApi = axios.create({
    baseURL: BOOKLY_CRED_API_BASE,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'Basic ' + btoa('wp_username:application_password'),
    },
  });

  const response = await credApi.post('/appointments', {
    service_id: payload.serviceId,
    staff_id: payload.staffId ?? DEFAULT_STAFF_ID,
    start_date: payload.date,
    start_time: payload.time,
    customer: {
      first_name: payload.customer.firstName,
      last_name: payload.customer.lastName,
      email: payload.customer.email,
      phone: payload.customer.phone,
      notes: [
        payload.customer.addressLine1,
        payload.customer.addressLine2,
        payload.customer.postcode,
        payload.customer.notes,
      ]
        .filter(Boolean)
        .join('\n'),
    },
  });

  const data = response.data;
  return {
    id: data.appointment_id,
    reference: data.token ?? `SG-${data.appointment_id}`,
    service: '',
    date: payload.date,
    time: payload.time,
    customerName: `${payload.customer.firstName} ${payload.customer.lastName}`,
  };
}

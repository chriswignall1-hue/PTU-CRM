import {Service} from '../types';

export const BRAND = {
  primary: '#E8501A',      // Smartech orange
  primaryDark: '#C43F10',
  dark: '#1A1A2E',
  surface: '#FFFFFF',
  surfaceAlt: '#F7F7F8',
  border: '#E8E8EE',
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  success: '#10B981',
  error: '#EF4444',
  white: '#FFFFFF',
} as const;

// Replace with your live WordPress site URL (no trailing slash)
export const WP_BASE_URL = 'https://www.smartechgas.co.uk';

// Bookly REST API addon base (install from CodeCanyon before going live)
export const BOOKLY_API_BASE = `${WP_BASE_URL}/wp-json/bookly-read-api/v1`;
export const BOOKLY_CRED_API_BASE = `${WP_BASE_URL}/wp-json/bookly-cred-api/v1`;

// Set to true to use hard-coded mock data while the API addon is being set up
export const USE_MOCK_API = true;

// Your Bookly staff member ID (find in WP Admin > Bookly > Staff Members)
export const DEFAULT_STAFF_ID = 1;

export const SERVICES: Service[] = [
  {
    id: 'boiler_service',
    booklyId: 1,
    name: 'Boiler Service',
    description:
      'Annual boiler service to keep your system running safely and efficiently.',
    duration: 60,
    price: 'From £75',
    icon: 'fire',
  },
  {
    id: 'gas_safety',
    booklyId: 2,
    name: 'Gas Safety Certificate',
    description:
      'Landlord CP12 gas safety inspection and certification for your property.',
    duration: 60,
    price: 'From £65',
    icon: 'shield-checkmark',
  },
  {
    id: 'boiler_repair',
    booklyId: 3,
    name: 'Boiler Repair',
    description:
      'Fault diagnosis and repair by our Gas Safe registered engineers.',
    duration: 90,
    price: 'From £85',
    icon: 'construct',
  },
  {
    id: 'boiler_installation',
    booklyId: 4,
    name: 'Boiler Installation',
    description:
      'New boiler supply and installation with full commissioning and warranty.',
    duration: 480,
    price: 'Quote required',
    icon: 'settings',
  },
];

export const SERVICE_ICONS: Record<string, string> = {
  boiler_service: '🔥',
  gas_safety: '🛡️',
  boiler_repair: '🔧',
  boiler_installation: '⚙️',
};

import { z } from 'zod';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  currency: string;
  notifications_enabled: boolean;
  language: string;
}

export interface Itinerary {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  destinations: Destination[];
  transports: Transport[];
}

export interface Destination {
  id: string;
  itinerary_id: string;
  name: string;
  start_date: string;
  end_date: string;
  notes?: string;
  images?: string[];
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  order: number;
}

export interface Transport {
  id: string;
  itinerary_id: string;
  type: TransportType;
  provider: string;
  booking_reference: string;
  departure: {
    location: string;
    datetime: string;
    terminal?: string;
  };
  arrival: {
    location: string;
    datetime: string;
    terminal?: string;
  };
  seats?: string[];
  notes?: string;
}

export type TransportType = 'flight' | 'train' | 'bus' | 'ferry';

export interface Expense {
  id: string;
  itinerary_id: string;
  destination_id?: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  description: string;
  date: string;
}

export type ExpenseCategory = 'accommodation' | 'transport' | 'food' | 'activities' | 'other';

export const transportSchema = z.object({
  type: z.enum(['flight', 'train', 'bus', 'ferry']),
  provider: z.string().min(1, 'Provider is required'),
  booking_reference: z.string().min(1, 'Booking reference is required'),
  departure: z.object({
    location: z.string().min(1, 'Departure location is required'),
    datetime: z.string().min(1, 'Departure time is required'),
    terminal: z.string().optional()
  }),
  arrival: z.object({
    location: z.string().min(1, 'Arrival location is required'),
    datetime: z.string().min(1, 'Arrival time is required'),
    terminal: z.string().optional()
  }),
  seats: z.array(z.string()).optional(),
  notes: z.string().optional()
});
// Aggiungiamo le interfacce per i Places
export interface PlaceSuggestion {
  id: string;
  name: string;
  rating?: number;
  vicinity?: string;
  location?: {
    lat: number;
    lng: number;
  };
  types?: string[];
  // Modifichiamo il tipo delle photos per corrispondere a quello di Google Places
  photos?: { getUrl: () => string }[];
}

// Schema per la validazione delle coordinate
export const locationSchema = z.object({
  lat: z.number(),
  lng: z.number()
});

// Schema per la validazione dei Places
export const placeSuggestionSchema = z.object({
  id: z.string(),
  name: z.string(),
  rating: z.number().optional(),
  vicinity: z.string().optional(),
  location: locationSchema.optional(),
  types: z.array(z.string()).optional(),
  photos: z.array(z.string()).optional()
});

// Schema per la risposta di distanza
export interface DistanceInfo {
  distance: string;   // es: "5.2 km"
  duration: string;   // es: "10 min"
}

// Altri tipi utili per Google Maps
export interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
}
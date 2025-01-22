import { create } from 'zustand';
import { format, addMinutes, isAfter, addDays } from 'date-fns';
import type { Destination, Transport } from '../types';
import { sendEmail } from './email';

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timeout?: number;
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  reminders: {
    checkIn: boolean;
    departure: boolean;
    activities: boolean;
    transport: {
      enabled: boolean;
      advanceTime: number; // minuti prima della partenza
    };
  };
}

interface NotificationState {
  notifications: Notification[];
  preferences: NotificationPreferences;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
  scheduleDestinationReminders: (destination: Destination) => void;
  scheduleTransportReminders: (transport: Transport) => void;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  email: true,
  push: true,
  reminders: {
    checkIn: true,
    departure: true,
    activities: true,
    transport: {
      enabled: true,
      advanceTime: 120 // 2 ore di default
    }
  }
};

// Mock email notification service
async function sendEmailNotification({ subject, message }: { subject: string; message: string }) {
  if (!import.meta.env.VITE_SENDGRID_API_KEY) {
    console.log('Mock email notification:', { subject, message });
    return;
  }

  try {
    await sendEmail({
      to: 'user@example.com', // In produzione, usa l'email dell'utente
      subject,
      text: message
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  preferences: DEFAULT_PREFERENCES,

  addNotification: (notification) => {
    const id = crypto.randomUUID();
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));

    if (notification.timeout) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, notification.timeout);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  updatePreferences: (preferences) => {
    set((state) => ({
      preferences: {
        ...state.preferences,
        ...preferences,
        reminders: {
          ...state.preferences.reminders,
          ...preferences.reminders,
        },
      },
    }));
  },

  scheduleDestinationReminders: (destination) => {
    const { preferences, addNotification } = get();
    if (!preferences.reminders.departure && !preferences.reminders.checkIn) return;

    const startDate = new Date(destination.start_date);
    const now = new Date();

    // Schedule departure reminder (2 days before)
    if (preferences.reminders.departure) {
      const departureReminder = addDays(startDate, -2);
      if (isAfter(departureReminder, now)) {
        const timeUntilReminder = departureReminder.getTime() - now.getTime();
        setTimeout(() => {
          addNotification({
            type: 'info',
            message: `Departure reminder: You're traveling to ${destination.name} in 2 days!`,
            timeout: 0,
          });
          // Send email notification
          if (preferences.email) {
            sendEmailNotification({
              subject: `Upcoming Trip to ${destination.name}`,
              message: `Your trip to ${destination.name} is in 2 days! Don't forget to pack and check your travel documents.`,
            });
          }
        }, timeUntilReminder);
      }
    }
  },

  scheduleTransportReminders: (transport) => {
    const { preferences, addNotification } = get();
    if (!preferences.reminders.transport.enabled) return;

    const departureTime = new Date(transport.departure.datetime);
    const now = new Date();
    const reminderTime = addMinutes(
      departureTime,
      -preferences.reminders.transport.advanceTime
    );

    if (isAfter(reminderTime, now)) {
      const timeUntilReminder = reminderTime.getTime() - now.getTime();
      
      setTimeout(() => {
        const message = `${transport.type.toUpperCase()} departure reminder: Your ${
          transport.type
        } from ${transport.departure.location} to ${
          transport.arrival.location
        } departs in ${
          preferences.reminders.transport.advanceTime / 60
        } hours (${format(departureTime, 'HH:mm')})`;

        addNotification({
          type: 'info',
          message,
          timeout: 0
        });

        // Send email notification
        if (preferences.email) {
          sendEmailNotification({
            subject: `Transport Departure Reminder: ${transport.provider} ${transport.booking_reference}`,
            message: `
              Your upcoming ${transport.type}:
              From: ${transport.departure.location}
              To: ${transport.arrival.location}
              Date: ${format(departureTime, 'MMMM d, yyyy')}
              Time: ${format(departureTime, 'HH:mm')}
              ${transport.departure.terminal ? `Terminal: ${transport.departure.terminal}` : ''}
              Booking Reference: ${transport.booking_reference}
              ${transport.seats ? `Seats: ${transport.seats.join(', ')}` : ''}
            `
          });
        }

        // Send push notification if enabled
        if (preferences.push && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('Transport Departure Reminder', {
            body: message,
            icon: '/path/to/icon.png' // Add appropriate icon
          });
        }
      }, timeUntilReminder);

      // Set additional reminder for check-in (if applicable)
      if (transport.type === 'flight') {
        const checkInTime = addMinutes(departureTime, -180); // 3 hours before for flights
        if (isAfter(checkInTime, now)) {
          const timeUntilCheckIn = checkInTime.getTime() - now.getTime();
          setTimeout(() => {
            addNotification({
              type: 'info',
              message: `Flight check-in reminder: Time to check in for your flight to ${transport.arrival.location}`,
              timeout: 0
            });
          }, timeUntilCheckIn);
        }
      }
    }
  }
}));

// Request push notification permission
export async function requestPushNotificationPermission() {
  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }
  return false;
}
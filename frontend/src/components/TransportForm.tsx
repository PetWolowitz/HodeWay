import React, { useState } from 'react';
import { Plane, Train, Bus, Ship } from 'lucide-react';
import { Button } from './ui/button';
import type { Transport, TransportType } from '../types';
import { transportSchema } from '../types';

interface TransportFormProps {
  transport?: Transport;
  onSubmit: (data: Omit<Transport, 'id' | 'itinerary_id'>) => void;
  onCancel: () => void;
}

const transportIcons = {
  flight: Plane,
  train: Train,
  bus: Bus,
  ferry: Ship
};

export function TransportForm({ transport, onSubmit, onCancel }: TransportFormProps) {
  const [type, setType] = useState<TransportType>(transport?.type || 'flight');
  const [provider, setProvider] = useState(transport?.provider || '');
  const [bookingReference, setBookingReference] = useState(transport?.booking_reference || '');
  const [departureLocation, setDepartureLocation] = useState(transport?.departure.location || '');
  const [departureDateTime, setDepartureDateTime] = useState(transport?.departure.datetime || '');
  const [departureTerminal, setDepartureTerminal] = useState(transport?.departure.terminal || '');
  const [arrivalLocation, setArrivalLocation] = useState(transport?.arrival.location || '');
  const [arrivalDateTime, setArrivalDateTime] = useState(transport?.arrival.datetime || '');
  const [arrivalTerminal, setArrivalTerminal] = useState(transport?.arrival.terminal || '');
  const [seats, setSeats] = useState<string[]>(transport?.seats || []);
  const [notes, setNotes] = useState(transport?.notes || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      type,
      provider,
      booking_reference: bookingReference,
      departure: {
        location: departureLocation,
        datetime: departureDateTime,
        terminal: departureTerminal || undefined
      },
      arrival: {
        location: arrivalLocation,
        datetime: arrivalDateTime,
        terminal: arrivalTerminal || undefined
      },
      seats: seats.length > 0 ? seats : undefined,
      notes: notes || undefined
    };

    try {
      transportSchema.parse(data);
      setErrors({});
      onSubmit(data);
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ form: error.message });
      }
    }
  };

  const addSeat = (seat: string) => {
    if (seat && !seats.includes(seat)) {
      setSeats([...seats, seat]);
    }
  };

  const removeSeat = (index: number) => {
    setSeats(seats.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transport Type
        </label>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(transportIcons).map(([key, Icon]) => (
            <button
              key={key}
              type="button"
              onClick={() => setType(key as TransportType)}
              className={`p-4 rounded-lg border ${
                type === key
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm capitalize">{key}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Provider
          </label>
          <input
            type="text"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Booking Reference
          </label>
          <input
            type="text"
            value={bookingReference}
            onChange={(e) => setBookingReference(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Departure</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={departureLocation}
              onChange={(e) => setDepartureLocation(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={departureDateTime}
              onChange={(e) => setDepartureDateTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Terminal/Platform
            </label>
            <input
              type="text"
              value={departureTerminal}
              onChange={(e) => setDepartureTerminal(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Arrival</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={arrivalLocation}
              onChange={(e) => setArrivalLocation(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={arrivalDateTime}
              onChange={(e) => setArrivalDateTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Terminal/Platform
            </label>
            <input
              type="text"
              value={arrivalTerminal}
              onChange={(e) => setArrivalTerminal(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Seats
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            placeholder="Add seat number"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSeat(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
        {seats.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {seats.map((seat, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {seat}
                <button
                  type="button"
                  onClick={() => removeSeat(index)}
                  className="ml-1 inline-flex items-center justify-center"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      {errors.form && (
        <p className="text-sm text-red-600">{errors.form}</p>
      )}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {transport ? 'Update' : 'Add'} Transport
        </Button>
      </div>
    </form>
  );
}
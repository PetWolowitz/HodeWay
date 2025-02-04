import React from 'react';
import { format } from 'date-fns';
import { Plane, Train, Bus, Ship, Clock, MapPin, Edit, Trash } from 'lucide-react';
import type { Transport } from '../../../types';
import { Button } from '../../common/button';

interface TransportListProps {
  transports: Transport[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const transportIcons = {
  flight: Plane,
  train: Train,
  bus: Bus,
  ferry: Ship
};

export function TransportList({ transports, onEdit, onDelete }: TransportListProps) {
  return (
    <div className="space-y-4">
      {transports.map((transport) => {
        const Icon = transportIcons[transport.type];
        const departureTime = new Date(transport.departure.datetime);
        const arrivalTime = new Date(transport.arrival.datetime);

        return (
          <div
            key={transport.id}
            className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/5 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">
                      {transport.provider}
                    </h3>
                    <span className="text-sm text-gray-500">
                      #{transport.booking_reference}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-[auto,1fr] gap-x-8 gap-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{format(departureTime, 'HH:mm')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{transport.departure.location}</span>
                      {transport.departure.terminal && (
                        <span className="text-gray-500">
                          (Terminal {transport.departure.terminal})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{format(arrivalTime, 'HH:mm')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{transport.arrival.location}</span>
                      {transport.arrival.terminal && (
                        <span className="text-gray-500">
                          (Terminal {transport.arrival.terminal})
                        </span>
                      )}
                    </div>
                  </div>

                  {transport.seats && transport.seats.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Seats: {transport.seats.join(', ')}
                      </p>
                    </div>
                  )}

                  {transport.notes && (
                    <p className="mt-2 text-sm text-gray-500">{transport.notes}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(transport.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(transport.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
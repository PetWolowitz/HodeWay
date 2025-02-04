import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MapPin, Calendar, Image, Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';
import type { Destination } from '@/types';
import { Button } from '../../common/button';

interface SortableDestinationProps {
  destination: Destination;
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableDestination({
  destination,
  onEdit,
  onDelete
}: SortableDestinationProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: destination.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Funzione per formattare la data solo se è valida
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Data non disponibile';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Data non valida' : format(date, 'MMM d');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm border p-4 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1"
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {destination.name}
              </h3>
              {destination.location.address && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4" />
                  {destination.location.address}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-gray-500 hover:text-red-600"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(destination.start_date)} -{' '}
                {formatDate(destination.end_date)}
              </span>
            </div>
          </div>
          {destination.images && destination.images.length > 0 && (
            <div className="mt-4">
              <div className="flex -space-x-2 overflow-hidden">
                {destination.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${destination.name} photo ${index + 1}`}
                    className="inline-block h-12 w-12 rounded-lg object-cover ring-2 ring-white"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
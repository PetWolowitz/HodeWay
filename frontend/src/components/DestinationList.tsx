import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableDestination } from './SortableDestination';
import type { Destination } from '../types';

interface DestinationListProps {
  destinations: Destination[];
  onReorder: (destinations: Destination[]) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DestinationList({
  destinations,
  onReorder,
  onEdit,
  onDelete
}: DestinationListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = destinations.findIndex((item) => item.id === active.id);
      const newIndex = destinations.findIndex((item) => item.id === over.id);

      const newDestinations = arrayMove(destinations, oldIndex, newIndex).map(
        (dest, index) => ({ ...dest, order: index + 1 })
      );

      onReorder(newDestinations);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={destinations}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {destinations.map((destination) => (
            <SortableDestination
              key={destination.id}
              destination={destination}
              onEdit={() => onEdit(destination.id)}
              onDelete={() => onDelete(destination.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import type { Destination } from '../types';
import { DestinationList } from './DestinationList';
import { DestinationForm } from './DestinationForm';

interface ItineraryFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    destinations: Destination[];
  }) => void;
  onCancel: () => void;
}

export function ItineraryForm({ onSubmit, onCancel }: ItineraryFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [editingDestination, setEditingDestination] = useState<string | null>(null);
  const [showDestinationForm, setShowDestinationForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      startDate,
      endDate,
      destinations
    });
  };

  const handleAddDestination = (destination: Partial<Destination>) => {
    const newDestination: Destination = {
      id: crypto.randomUUID(),
      itinerary_id: '',
      name: destination.name || '',
      start_date: destination.start_date || '',
      end_date: destination.end_date || '',
      location: destination.location || { lat: 0, lng: 0 },
      order: destinations.length + 1,
      images: destination.images || []
    };

    setDestinations([...destinations, newDestination]);
    setShowDestinationForm(false);
  };

  const handleUpdateDestination = (destination: Partial<Destination>) => {
    setDestinations(destinations.map(d => 
      d.id === editingDestination
        ? { ...d, ...destination }
        : d
    ));
    setEditingDestination(null);
  };

  const handleDeleteDestination = (id: string) => {
    setDestinations(destinations.filter(d => d.id !== id));
  };

  const handleReorderDestinations = (newDestinations: Destination[]) => {
    setDestinations(newDestinations);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Destinations</h3>
          <Button
            type="button"
            onClick={() => setShowDestinationForm(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Destination
          </Button>
        </div>

        {showDestinationForm ? (
          <div className="bg-gray-50 rounded-lg p-6">
            <DestinationForm
              onSubmit={handleAddDestination}
              onCancel={() => setShowDestinationForm(false)}
            />
          </div>
        ) : editingDestination ? (
          <div className="bg-gray-50 rounded-lg p-6">
            <DestinationForm
              destination={destinations.find(d => d.id === editingDestination)}
              onSubmit={handleUpdateDestination}
              onCancel={() => setEditingDestination(null)}
            />
          </div>
        ) : (
          <DestinationList
            destinations={destinations}
            onReorder={handleReorderDestinations}
            onEdit={setEditingDestination}
            onDelete={handleDeleteDestination}
          />
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Itinerary
        </Button>
      </div>
    </form>
  );
}
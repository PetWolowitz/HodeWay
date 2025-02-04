import React, { useState } from 'react';
import { MapPin, Calendar, Image as ImageIcon, X } from 'lucide-react';
import type { Destination } from '@/types';
import { Button } from '../../common/button';
import { LocationPicker } from './LocationPicker';

interface DestinationFormProps {
  destination?: Destination;
  onSubmit: (destination: Partial<Destination>) => void;
  onCancel: () => void;
}

export function DestinationForm({
  destination,
  onSubmit,
  onCancel
}: DestinationFormProps) {
  const [name, setName] = useState(destination?.name || '');
  const [startDate, setStartDate] = useState(destination?.start_date || '');
  const [endDate, setEndDate] = useState(destination?.end_date || '');
  const [location, setLocation] = useState(destination?.location || { lat: 0, lng: 0 });
  const [images, setImages] = useState<string[]>(destination?.images || []);
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      start_date: startDate,
      end_date: endDate,
      location,
      images,
      order: destination?.order || 1
    });
  };

  const addImage = () => {
    if (imageUrl && !images.includes(imageUrl)) {
      setImages([...images, imageUrl]);
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <LocationPicker value={location} onChange={setLocation} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images
        </label>
        <div className="flex gap-2 mb-4">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
          <Button
            type="button"
            onClick={addImage}
            
            className="flex items-center gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            Add Image
          </Button>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Destination image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button"  onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {destination ? 'Update' : 'Add'} Destination
        </Button>
      </div>
    </div>
  );
}
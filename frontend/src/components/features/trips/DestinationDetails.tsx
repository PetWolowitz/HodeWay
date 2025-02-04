import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';
import type { Destination } from '@/types';
import { calculateDistance, searchNearbyPlaces } from '../../lib/maps';
import { Button } from '../../common/button';

interface DestinationDetailsProps {
  destination: Destination;
  previousDestination?: Destination;
}

interface PlaceSuggestion {
  name: string;
  rating?: number;
  vicinity?: string;
  photos?: { getUrl: () => string }[];
}

export function DestinationDetails({ destination, previousDestination }: DestinationDetailsProps) {
  const [distance, setDistance] = useState<{ distance: string; duration: string } | null>(null);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Get nearby attractions
        const places = await searchNearbyPlaces(destination.location);
        setSuggestions(places);

        // Calculate distance from previous destination if it exists
        if (previousDestination) {
          const distanceInfo = await calculateDistance(previousDestination, destination);
          setDistance(distanceInfo);
        }
      } catch (error) {
        console.error('Failed to load destination details:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [destination, previousDestination]);

  return (
    <div className="space-y-6">
      {/* Distance Information */}
      {distance && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Travel Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">{distance.distance}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">{distance.duration}</span>
            </div>
          </div>
        </div>
      )}

      {/* Points of Interest */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Nearby Attractions
          </h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-sm text-gray-500 mt-2">Loading suggestions...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.slice(0, 6).map((place, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  {place.photos?.[0] && (
                    <img
                      src={place.photos[0].getUrl()}
                      alt={place.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h4 className="font-medium text-gray-900">{place.name}</h4>
                  {place.rating && (
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.round(place.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-1">
                        ({place.rating})
                      </span>
                    </div>
                  )}
                  {place.vicinity && (
                    <p className="text-sm text-gray-500 mt-1">{place.vicinity}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationPickerProps {
  value: Location;
  onChange: (location: Location) => void;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: value.lat || 0, lng: value.lng || 0 },
          zoom: 13,
          mapTypeControl: false,
        });

        const marker = new google.maps.Marker({
          map,
          position: { lat: value.lat || 0, lng: value.lng || 0 },
          draggable: true,
        });

        const input = document.createElement('input');
        input.className = 'map-search-box';
        input.placeholder = 'Search for a location';
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        const searchBox = new google.maps.places.SearchBox(input);

        map.addListener('click', (e: google.maps.MapMouseEvent) => {
          const latLng = e.latLng;
          if (latLng) {
            marker.setPosition(latLng);
            updateLocation(latLng);
          }
        });

        marker.addListener('dragend', () => {
          const position = marker.getPosition();
          if (position) {
            updateLocation(position);
          }
        });

        searchBox.addListener('places_changed', () => {
          const places = searchBox.getPlaces();
          if (places && places.length > 0) {
            const place = places[0];
            if (place.geometry && place.geometry.location) {
              map.setCenter(place.geometry.location);
              marker.setPosition(place.geometry.location);
              updateLocation(place.geometry.location, place.formatted_address);
            }
          }
        });

        setMap(map);
        setMarker(marker);
        setSearchBox(searchBox);
      }
    });
  }, []);

  const updateLocation = (
    position: google.maps.LatLng,
    address?: string
  ) => {
    onChange({
      lat: position.lat(),
      lng: position.lng(),
      address
    });
  };

  return (
    <div className="w-full">
      <div
        ref={mapRef}
        className="w-full h-[300px] rounded-lg shadow-md"
      />
      <style>{`
        .map-search-box {
          margin: 10px;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
          width: 300px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
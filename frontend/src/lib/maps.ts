import { Loader } from '@googlemaps/js-api-loader';
import type { Destination, DistanceInfo, PlaceSuggestion } from '@/types';

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places']
});

export function calculateDistance(from: { location: { lat: number; lng: number } }, to: { location: { lat: number; lng: number } }): DistanceInfo {
  const R = 6371;
  const dLat = (to.location.lat - from.location.lat) * Math.PI / 180;
  const dLon = (to.location.lng - from.location.lng) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(from.location.lat * Math.PI / 180) * Math.cos(to.location.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  const duration = distance / 60;

  return {
    distance: `${distance.toFixed(1)} km`,
    duration: `${Math.round(duration * 60)} min`
  };
}

export async function searchNearbyPlaces(location: { lat: number; lng: number }): Promise<PlaceSuggestion[]> {
  await loader.load();
  
  return new Promise((resolve, reject) => {
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );
    
    service.nearbySearch({
      location,
      radius: 5000,
      type: 'tourist_attraction'  // Modifica qui: stringa singola invece di array
    }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const suggestions: PlaceSuggestion[] = results
          .filter((place): place is google.maps.places.PlaceResult & { name: string } => 
            place.name !== undefined && place.name !== null
          )
          .map(place => ({
            id: place.place_id || crypto.randomUUID(),
            name: place.name,
            rating: place.rating || undefined,
            vicinity: place.vicinity || undefined,
            location: place.geometry?.location ? {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            } : undefined,
            types: place.types || undefined,
            photos: place.photos
          }));
        resolve(suggestions);
      } else {
        reject(new Error('Failed to find nearby places'));
      }
    });
  });
}
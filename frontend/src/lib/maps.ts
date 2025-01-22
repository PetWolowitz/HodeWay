import { Loader } from '@googlemaps/js-api-loader';
import type { Destination } from '../types';

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places']
});

export async function calculateDistance(origin: Destination, destination: Destination): Promise<{
  distance: string;
  duration: string;
}> {
  await loader.load();
  
  return new Promise((resolve, reject) => {
    const service = new google.maps.DistanceMatrixService();
    
    service.getDistanceMatrix({
      origins: [{ lat: origin.location.lat, lng: origin.location.lng }],
      destinations: [{ lat: destination.location.lat, lng: destination.location.lng }],
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status) => {
      if (status === 'OK' && response) {
        const result = response.rows[0].elements[0];
        resolve({
          distance: result.distance.text,
          duration: result.duration.text
        });
      } else {
        reject(new Error('Failed to calculate distance'));
      }
    });
  });
}

export async function searchNearbyPlaces(location: { lat: number; lng: number }): Promise<google.maps.places.PlaceResult[]> {
  await loader.load();
  
  return new Promise((resolve, reject) => {
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );
    
    service.nearbySearch({
      location,
      radius: 5000, // 5km radius
      type: ['tourist_attraction']
    }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        resolve(results);
      } else {
        reject(new Error('Failed to find nearby places'));
      }
    });
  });
}
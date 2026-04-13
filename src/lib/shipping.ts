/**
 * Shipping calculation utility for J&T Simulation
 * Origin: Tagbilaran City, Bohol
 */

export const ORIGIN_COORDS = {
  lat: 9.6500,
  lng: 123.8500
};

export interface ShippingDetails {
  fee: number;
  region: string;
  distance: number;
}

export function calculateShipping(lat: number, lng: number): ShippingDetails {
  const distance = getDistance(ORIGIN_COORDS.lat, ORIGIN_COORDS.lng, lat, lng);
  
  let fee = 200;
  let region = 'Luzon/Mindanao';

  if (distance < 5) {
    fee = 0;
    region = 'Store Pickup (Free)';
  } else if (distance < 50) {
    fee = 80;
    region = 'Intra-Bohol';
  } else if (distance < 300) {
    fee = 150;
    region = 'Visayas';
  }

  return { fee, region, distance };
}

/**
 * Haversine formula to calculate distance between two points in km
 */
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const r = 6371; // Radius of the earth in km
  const phi1 = deg2rad(lat1);
  const phi2 = deg2rad(lat2);
  const deltaPhi = deg2rad(lat2 - lat1);
  const deltaLambda = deg2rad(lon2 - lon1);

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = r * c;
  
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

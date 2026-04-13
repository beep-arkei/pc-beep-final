import React, { useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon, LatLngLiteral } from 'leaflet';
import { Loader2, MapPin, Search } from 'lucide-react';
import { ORIGIN_COORDS } from '../lib/shipping';

// Fix for default marker icons in Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface LocationPickerProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number };
}

function DraggableMarker({ position, onPositionChange }: { 
  position: LatLngLiteral, 
  onPositionChange: (pos: LatLngLiteral) => void 
}) {
  const eventHandlers = useMemo(
    () => ({
      dragend(e: any) {
        const marker = e.target;
        if (marker != null) {
          onPositionChange(marker.getLatLng());
        }
      },
    }),
    [onPositionChange],
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      icon={defaultIcon}
    />
  );
}

function MapEvents({ onMapClick }: { onMapClick: (pos: LatLngLiteral) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, initialLocation }) => {
  const [markerPosition, setMarkerPosition] = useState<LatLngLiteral>(initialLocation || ORIGIN_COORDS);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const reverseGeocode = useCallback(async (pos: LatLngLiteral) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'PC-Beep-App'
          }
        }
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
        onLocationSelect({
          address: data.display_name,
          lat: pos.lat,
          lng: pos.lng
        });
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    } finally {
      setLoading(false);
    }
  }, [onLocationSelect]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'PC-Beep-App'
          }
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const newPos = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
        setMarkerPosition(newPos);
        setAddress(data[0].display_name);
        onLocationSelect({
          address: data[0].display_name,
          lat: newPos.lat,
          lng: newPos.lng
        });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePositionChange = (pos: LatLngLiteral) => {
    setMarkerPosition(pos);
    reverseGeocode(pos);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search for your location (e.g. Tagbilaran City)..."
          className="w-full pl-12 pr-24 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-cyan outline-none shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-navy text-white text-[10px] font-black rounded-xl hover:bg-navy/90 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : 'SEARCH'}
        </button>
      </form>

      <div className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-slate-100 shadow-inner z-0">
        <MapContainer
          center={markerPosition}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker position={markerPosition} onPositionChange={handlePositionChange} />
          <MapEvents onMapClick={handlePositionChange} />
        </MapContainer>
        
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-white shadow-lg flex items-start gap-3 z-[1000]">
          <MapPin className="text-cyan shrink-0 mt-0.5" size={16} />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Selected Delivery Point</p>
            <p className="text-xs text-navy font-bold leading-tight line-clamp-2">
              {loading ? 'Locating...' : (address || 'Click map or drag pin to select location')}
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest">
        Click anywhere on the map or drag the pin to set your exact delivery location
      </p>
    </div>
  );
};

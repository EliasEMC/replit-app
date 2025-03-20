import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in react-leaflet
const icon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface Property {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  description: string;
}

interface PropertyMapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  initialProperties?: Property[];
  initialLocation?: { lat: number; lng: number } | null;
}

// Componente para manejar eventos del mapa
function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

export default function PropertyMap({ 
  onLocationSelect, 
  initialProperties = [],
  initialLocation
}: PropertyMapProps) {
  const { t } = useTranslation();
  const center: [number, number] = initialLocation 
    ? [initialLocation.lat, initialLocation.lng]
    : [19.4326, -99.1332]; // Mexico City por defecto

  return (
    <MapContainer 
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Marcador de ubicación seleccionada */}
      {initialLocation && (
        <Marker 
          position={[initialLocation.lat, initialLocation.lng]}
          icon={icon}
        >
          <Popup>
            {t('properties.form.selected_location')}
          </Popup>
        </Marker>
      )}

      {/* Marcadores de propiedades existentes */}
      {initialProperties.map((property) => (
        <Marker
          key={property.id}
          position={[property.latitude, property.longitude]}
          icon={icon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">{property.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{property.type}</p>
              <p className="mt-2">{property.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Componente para manejar clicks en el mapa */}
      {onLocationSelect && <LocationMarker onLocationSelect={onLocationSelect} />}
    </MapContainer>
  );
}

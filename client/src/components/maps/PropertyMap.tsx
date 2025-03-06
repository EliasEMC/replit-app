import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useTranslation } from "react-i18next";

// Fix for default marker icon in react-leaflet
const icon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Sample property locations
const properties = [
  {
    id: 1,
    name: "Industrial Park Alpha",
    position: [19.4326, -99.1332], // Mexico City coordinates
    type: "industrial",
    description: "Modern industrial complex with excellent connectivity"
  },
  {
    id: 2,
    name: "Commercial Center Beta",
    position: [19.4361, -99.1375],
    type: "commercial",
    description: "Prime location commercial space in business district"
  },
  {
    id: 3,
    name: "Logistics Hub Gamma",
    position: [19.4275, -99.1276],
    type: "industrial",
    description: "Strategic logistics center with highway access"
  }
];

export default function PropertyMap() {
  const { t } = useTranslation();
  
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer 
        center={[19.4326, -99.1332]} // Centered on Mexico City
        zoom={13} 
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property) => (
          <Marker 
            key={property.id} 
            position={property.position as [number, number]}
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
      </MapContainer>
    </div>
  );
}

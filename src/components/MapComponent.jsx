import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = L.divIcon({
  html: renderToStaticMarkup(<MapPin color="#6366f1" size={32} fill="#6366f122" />),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: 'custom-pin'
});

function MapEvents({ onMove }) {
  const map = useMapEvents({
    moveend: () => {
      onMove(map.getCenter());
    },
  });
  return null;
}

function LocationMarker({ onLocationFound }) {
  const map = useMap();
  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, 16);
      onLocationFound(e.latlng);
    });
  }, [map]);
  return null;
}

export default function MapComponent({ pins, onPinClick, onLocationChange }) {
  return (
    <MapContainer 
      center={[-22.9136, -43.1818]} 
      zoom={13} 
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <LocationMarker onLocationFound={onLocationChange} />
      <MapEvents onMove={onLocationChange} />
      
      {pins.map((pin) => (
        <Marker 
          key={pin.id} 
          position={[pin.lat, pin.lon]} 
          icon={customIcon}
          eventHandlers={{
            click: () => onPinClick(pin),
          }}
        >
          <Popup>
            <div className="font-bold">{pin.name}</div>
            <div className="text-xs text-gray-500">{pin.type}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

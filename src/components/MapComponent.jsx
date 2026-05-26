import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useT } from '../i18n';
import { renderToString } from 'react-dom/server';
import { Castle, Shield, Landmark, Church, MapPin, Heart, Pickaxe, Map as MapIcon, Swords, Train, Building, GraduationCap, Milestone, Drama, Sparkles, Flag } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TYPE_COLORS = {
  castle:              '#7C3AED',
  fort:                '#7C3AED',
  museum:              '#2563EB',
  church:              '#D97706',
  monument:            '#F97316',
  memorial:            '#E879F9',
  ruins:               '#B45309',
  archaeological_site: '#A16207',
  battlefield:         '#DC2626',
  station:             '#0284C7',
  district:            '#16A34A',
  historical_landmark: '#6366F1',
  university:          '#0D9488',
  bridge:              '#64748B',
  theater:             '#BE185D',
  wonder:              '#EAB308',
  event_site:          '#7C2D12',
};

const TYPE_ICONS = {
  castle: Castle,
  fort: Shield,
  museum: Landmark,
  church: Church,
  monument: MapPin,
  memorial: Heart,
  ruins: Pickaxe,
  archaeological_site: MapIcon,
  battlefield: Swords,
  station: Train,
  district: Building,
  historical_landmark: Landmark,
  university: GraduationCap,
  bridge: Milestone,
  theater: Drama,
  wonder: Sparkles,
  event_site: Flag,
};

export const TYPE_LABELS = {
  castle:              'Castelo / Forte',
  fort:                'Forte Histórico',
  museum:              'Museu',
  church:              'Igreja / Catedral',
  monument:            'Monumento',
  memorial:            'Memorial',
  ruins:               'Ruínas',
  archaeological_site: 'Sítio Arqueológico',
  battlefield:         'Campo de Batalha',
  station:             'Estação',
  district:            'Bairro / Distrito',
  historical_landmark: 'Marco Histórico',
  university:          'Universidade Histórica',
  bridge:              'Ponte Histórica',
  theater:             'Teatro / Ópera',
  wonder:              'Maravilha do Mundo',
  event_site:          'Local de Evento Histórico',
};

function createPin(type, index = 0) {
  const color = TYPE_COLORS[type] || '#6366F1';
  const delay = Math.min(index * 0.04, 0.8);
  const IconCmp = TYPE_ICONS[type] || MapPin;
  const iconSvg = renderToString(<IconCmp size={16} color="white" strokeWidth={2.5} />);

  return L.divIcon({
    html: `
      <div class="animate-pin-pop" style="animation-delay: ${delay}s; position:relative;width:32px;height:44px;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.35))">
        <svg viewBox="0 0 32 44" xmlns="http://www.w3.org/2000/svg" width="32" height="44" style="position:absolute;inset:0;">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 28 16 28S32 26 32 16C32 7.163 24.837 0 16 0z" fill="${color}" />
        </svg>
        <div style="position:absolute; top: 8px; left: 8px; width: 16px; height: 16px; display:flex; align-items:center; justify-content:center;">
          ${iconSvg}
        </div>
      </div>
    `,
    iconSize: [32, 44],
    iconAnchor: [16, 44],
    popupAnchor: [0, -38],
    className: 'custom-marker',
  });
}

const userPin = L.divIcon({
  html: `
    <div style="position:relative;width:52px;height:52px;">
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:rgba(59,130,246,0.3);
        animation:userPulse 2.2s ease-out infinite;
      "></div>
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:rgba(59,130,246,0.15);
        animation:userPulse 2.2s ease-out 0.7s infinite;
      "></div>
      <div style="
        position:absolute;inset:15px;border-radius:50%;
        background:#3B82F6;
        box-shadow:0 0 16px rgba(59,130,246,0.8);
        border: 2px solid white;
      "></div>
    </div>
  `,
  iconSize: [52, 52],
  iconAnchor: [26, 26],
  className: 'custom-marker',
});


function FlyToLocation({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center?.lat && center?.lng) {
      map.flyTo([center.lat, center.lng], 16, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

function MapCenterTracker({ onMapMove }) {
  useMapEvents({
    moveend: (e) => {
      const c = e.target.getCenter();
      onMapMove({ lat: c.lat, lng: c.lng });
    },
  });
  return null;
}

const createClusterCustomIcon = function (cluster) {
  return L.divIcon({
    html: `<div class="custom-cluster-icon"><span>${cluster.getChildCount()}</span></div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(40, 40, true),
  });
};

export default function MapComponent({ pins, onPinClick, userPosition, externalCenter, onOpenStory, onMapMove, selectedPlace, lang = 'pt-BR' }) {
  const t = useT(lang);
  return (
    <div className="absolute inset-0 z-0">
      <MapContainer
        center={[0, 0]}
        zoom={3}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />

        {userPosition && <Marker position={[userPosition.lat, userPosition.lng]} icon={userPin} zIndexOffset={1000} />}
        <FlyToLocation center={externalCenter} />
        {onMapMove && <MapCenterTracker onMapMove={onMapMove} />}

        <MarkerClusterGroup 
          chunkedLoading 
          spiderfyOnMaxZoom 
          showCoverageOnHover={false}
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={40}
        >
          {pins.map((pin, index) => (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lon]}
              icon={createPin(pin.type, index)}
              eventHandlers={{ click: () => onPinClick(pin) }}
            >
              <Popup className="transparent-popup" closeButton={false}>
                {selectedPlace?.id !== pin.id && (
                  <motion.div
                    layoutId={`story-card-${pin.id}`}
                    initial={{ scale: 0.3, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 1 }}
                    className="marker-preview-card"
                  >
                    <div className="marker-preview-type">
                      {t.typeLabels[pin.type] || t.typeLabels.historical_landmark}
                    </div>
                    <h3 className="marker-preview-name">{pin.name}</h3>
                    <button className="marker-preview-open" onClick={(e) => {
                      e.stopPropagation();
                      if(onOpenStory) onOpenStory(pin);
                    }}>
                      {t.viewStory}
                      <ChevronRight size={15} />
                    </button>
                  </motion.div>
                )}
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

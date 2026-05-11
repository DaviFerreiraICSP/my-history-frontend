import { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import StoryPanel from './components/StoryPanel';
import axios from 'axios';
import { History, Search, Navigation } from 'lucide-react';

const API_BASE = 'http://localhost:3000';

function App() {
  const [pins, setPins] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [story, setStory] = useState(null);
  const [loadingStory, setLoadingStory] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const fetchNearby = async (lat, lon) => {
    try {
      const res = await axios.get(`${API_BASE}/history/nearby`, {
        params: { lat, lon }
      });
      setPins(res.data);
    } catch (err) {
      console.error('Error fetching nearby sites', err);
    }
  };

  const handlePinClick = async (pin) => {
    setSelectedPlace(pin);
    setLoadingStory(true);
    setStory(null);
    try {
      const res = await axios.get(`${API_BASE}/history/story`, {
        params: { 
          name: pin.name,
          lat: pin.lat,
          lon: pin.lon
        }
      });
      setStory(res.data.story);
    } catch (err) {
      console.error('Error fetching story', err);
    } finally {
      setLoadingStory(false);
    }
  };

  const handleLocationChange = (coords) => {
    setCurrentLocation(coords);
    fetchNearby(coords.lat, coords.lng || coords.lon);
  };

  return (
    <div className="relative w-full h-full">
      {/* Header Overlay */}
      <div className="absolute top-6 left-6 z-[1001] flex items-center gap-4">
        <div className="glass px-6 py-4 flex items-center gap-3">
          <History className="text-indigo-400" size={28} />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Chronos Path</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">Onde o passado ganha voz</p>
          </div>
        </div>
      </div>

      {/* Map Background */}
      <MapComponent 
        pins={pins} 
        onPinClick={handlePinClick} 
        onLocationChange={handleLocationChange}
      />

      {/* UI Elements Overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1001] flex gap-4">
        <button className="glass p-4 hover:bg-indigo-500/20 transition-all group">
          <Search size={24} className="group-hover:scale-110 transition-transform" />
        </button>
        <div className="glass px-6 py-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Buscando segredos ao seu redor...</span>
        </div>
        <button className="glass p-4 hover:bg-indigo-500/20 transition-all group">
          <Navigation size={24} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Story Panel */}
      <StoryPanel 
        selectedPlace={selectedPlace}
        story={story}
        loading={loadingStory}
        onClose={() => setSelectedPlace(null)}
      />

      {/* Dark Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 z-[999] shadow-[inset_0_0_150px_rgba(0,0,0,0.5)]" />
    </div>
  );
}

export default App;

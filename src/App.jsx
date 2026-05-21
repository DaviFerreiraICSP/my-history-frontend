import { useState, useCallback, useRef } from 'react';
import { Navigation, Compass, Settings, Globe, Bot, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MapComponent from './components/MapComponent';
import SearchBar from './components/SearchBar';
import StoryPanel from './components/StoryPanel';
import logoNoBackground from './assets/our_history_logo_nobackgrnd.png';
import axios from 'axios';
import { useT } from './i18n';

const API_BASE = import.meta.env.VITE_API_URL || 'https://my-history-backend.vercel.app';

function App() {
  const [pins, setPins] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [story, setStory] = useState(null);
  const [loadingStory, setLoadingStory] = useState(false);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [locating, setLocating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lang, setLang] = useState('pt-BR');
  const [aiGuide, setAiGuide] = useState('historian');

  const t = useT(lang);
  const viewCenterRef = useRef(null);

  const fetchNearby = useCallback(async (lat, lon) => {
    setLoadingNearby(true);
    try {
      const res = await axios.get(`${API_BASE}/history/nearby`, { params: { lat, lon } });
      setPins(res.data);
    } catch (err) {
      console.error('Error fetching nearby', err);
    } finally {
      setLoadingNearby(false);
    }
  }, []);

  const handleMapMove = useCallback((center) => {
    viewCenterRef.current = center;
  }, []);

  // Only called by button tap — required by iOS Safari for geolocation permission
  const handleGoToUserLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        const center = { lat, lng };
        setUserPosition(center);
        setMapCenter(center);
        viewCenterRef.current = center;
        fetchNearby(lat, lng);
        setLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleScan = () => {
    const center = viewCenterRef.current || mapCenter;
    if (center) fetchNearby(center.lat, center.lng);
  };

  const handleSearchSelect = useCallback(({ lat, lng }) => {
    const center = { lat, lng };
    setMapCenter(center);
    viewCenterRef.current = center;
    fetchNearby(lat, lng);
  }, [fetchNearby]);

  const fetchStory = async (pin) => {
    setSelectedPlace(pin);
    setLoadingStory(true);
    setStory(null);
    try {
      const res = await axios.get(`${API_BASE}/history/story`, {
        params: { name: pin.name, lat: pin.lat, lon: pin.lon, lang, aiGuide }
      });
      setStory({ text: res.data.story, photo: res.data.photoUrl, wikiUrl: res.data.wikiUrl });
    } catch (err) {
      console.error('Error fetching story', err);
    } finally {
      setLoadingStory(false);
    }
  };

  const handlePinClick = (pin) => {
    if (selectedPlace) { setSelectedPlace(null); setStory(null); }
  };

  const statusLabel = loadingNearby
    ? t.loadingNearby
    : pins.length === 0
      ? t.noPlaces
      : t.placesFound(pins.length);

  return (
    <div className="app-root">
      <div className="app-header">
        <motion.div
          layout
          className={`app-header-pill ${isSettingsOpen ? 'is-expanded' : ''}`}
          style={{ borderRadius: isSettingsOpen ? 24 : 999 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <motion.div layout className="app-header-row">
            <motion.img layout src={logoNoBackground} alt="Our History" className="app-logo" />
            <motion.div layout className="app-header-text">
              <span className="app-title">Our History</span>
              <span className="app-subtitle">{statusLabel}</span>
            </motion.div>
            {loadingNearby && !isSettingsOpen && <motion.div layout className="app-header-spinner" />}

            <motion.button
              layout
              className="app-header-settings-btn"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              aria-label={isSettingsOpen ? 'Fechar' : 'Configurações'}
            >
              {isSettingsOpen ? <X size={18} /> : <Settings size={18} />}
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div
                className="app-header-settings-content"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <span className="settings-section-title-light">{t.settingsGeneral}</span>
                  <div className="settings-option-light">
                    <div className="settings-option-label-light">
                      <Globe size={18} className="settings-option-icon-light" />
                      {t.settingsLanguage}
                    </div>
                    <select
                      className="settings-select-light"
                      value={lang}
                      onChange={(e) => setLang(e.target.value)}
                    >
                      <option value="pt-BR">Português</option>
                      <option value="en-US">English</option>
                      <option value="es-ES">Español</option>
                      <option value="fr-FR">Français</option>
                      <option value="de-DE">Deutsch</option>
                      <option value="zh-CN">中文</option>
                      <option value="ja-JP">日本語</option>
                      <option value="ru-RU">Русский</option>
                    </select>
                  </div>
                </div>

                <div>
                  <span className="settings-section-title-light">{t.settingsAI}</span>
                  <div className="settings-option-light">
                    <div className="settings-option-label-light">
                      <Bot size={18} className="settings-option-icon-light" />
                      {t.settingsGuide}
                    </div>
                    <select
                      className="settings-select-light"
                      value={aiGuide}
                      onChange={(e) => setAiGuide(e.target.value)}
                    >
                      <option value="historian">{t.guideHistorian}</option>
                      <option value="professor">{t.guideProfessor}</option>
                      <option value="child">{t.guideChild}</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <MapComponent
        externalCenter={mapCenter}
        pins={pins}
        onPinClick={handlePinClick}
        userPosition={userPosition}
        onOpenStory={(pin) => fetchStory(pin)}
        onMapMove={handleMapMove}
        selectedPlace={selectedPlace}
        lang={lang}
      />

      <SearchBar onLocationSelect={handleSearchSelect} lang={lang} />

      <div className="floating-dock-container">
        <div className="floating-dock">
          <button
            onClick={handleGoToUserLocation}
            className={`dock-btn-locate ${locating ? 'dock-btn-locating' : ''}`}
            aria-label={t.locate}
          >
            <Navigation size={20} className={locating ? 'animate-spin' : ''} />
          </button>

          <button onClick={handleScan} className="dock-btn-scan">
            <Compass size={20} className={loadingNearby ? 'animate-spin' : ''} />
            <span>{t.scan}</span>
          </button>
        </div>
      </div>

      <StoryPanel
        selectedPlace={selectedPlace}
        story={story}
        loading={loadingStory}
        onClose={() => { setSelectedPlace(null); setStory(null); }}
        lang={lang}
      />

      <AnimatePresence>
        {loadingNearby && (
          <motion.div
            className="radar-wave-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="radar-wave" />
            <div className="radar-wave" style={{ animationDelay: '1s' }} />
            <div className="radar-wave" style={{ animationDelay: '2s' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="app-vignette" />
    </div>
  );
}

export default App;

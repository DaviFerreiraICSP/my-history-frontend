import { useState, useCallback, useRef, useEffect } from 'react';
import { Navigation, Compass, Settings, Globe, Bot, X, Sun, Moon, Heart, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoBlack from './assets/logo_black.png';
import logoWhite from './assets/logo_white.png';
import MapComponent, { TYPE_COLORS } from './components/MapComponent';
import SearchBar from './components/SearchBar';
import OnboardingOverlay from './components/OnboardingOverlay';
import AboutModal from './components/AboutModal';
import DonationModal from './components/DonationModal';
import FeedbackModal from './components/FeedbackModal';
import StoryPanel from './components/StoryPanel';
import axios from 'axios';
import { useT } from './i18n';

const API_BASE = import.meta.env.VITE_API_URL || 'https://my-history-backend.vercel.app';

const SEVEN_WONDERS = [
  { id: 'wonder_colosseum',       name: 'Coliseu',                 lat:  41.8902, lon:  12.4922, type: 'wonder' },
  { id: 'wonder_great_wall',      name: 'Grande Muralha da China', lat:  40.4319, lon: 116.5704, type: 'wonder' },
  { id: 'wonder_christ_redeemer', name: 'Cristo Redentor',         lat: -22.9519, lon: -43.2105, type: 'wonder' },
  { id: 'wonder_machu_picchu',    name: 'Machu Picchu',            lat: -13.1631, lon: -72.5450, type: 'wonder' },
  { id: 'wonder_chichen_itza',    name: 'Chichen Itzá',            lat:  20.6843, lon: -88.5678, type: 'wonder' },
  { id: 'wonder_taj_mahal',       name: 'Taj Mahal',               lat:  27.1751, lon:  78.0421, type: 'wonder' },
  { id: 'wonder_petra',           name: 'Petra',                   lat:  30.3285, lon:  35.4444, type: 'wonder' },
  { id: 'wonder_pyramid_giza',    name: 'Pirâmides de Gizé',       lat:  29.9792, lon:  31.1342, type: 'wonder' },
];

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function toWikiLang(appLang) {
  const map = { 'pt-BR':'pt','es-ES':'es','fr-FR':'fr','de-DE':'de','zh-CN':'zh','ja-JP':'ja','ru-RU':'ru' };
  return map[appLang] || 'en';
}

function cleanWikiTitle(title) {
  return title.replace(/\s*\([^)]+\)\s*$/, '').trim();
}

function inferTypeFromTitle(title) {
  const t = title.toLowerCase();

  // Religious
  if (/catedral|basílica|basilica|igreja|chapel|church|mosteiro|monastery|convento|convent|abadia|abbey|santuário|santuario|ermida|oratório|oratorio|paróquia|paroquia|capelinha|\bsé\b|\bmatriz\b|templo (histórico|de)|cripta/.test(t)) return 'church';

  // Museums & cultural spaces
  if (/museu|museum|pinacoteca|galeria de arte|gallery|centro cultural|cultural cent|casa de cultura|arquivo (histórico|público|municipal|estadual|nacional)|biblioteca (nacional|estadual|municipal)|observatório|observatorio/.test(t)) return 'museum';

  // Castles, forts & fortifications
  if (/castelo|castle|forte\b|fort\b|fortaleza|fortress|cidadela|citadel|muralha|torre de defesa|bastião|bastiao|baluarte|fortim|reduto/.test(t)) return 'castle';

  // Memorials & cemeteries
  if (/memorial|cemitério|cemiterio|cemetery|túmulo|tumulo|mausoléu|mausoleu|mausoleum|necrópole|necropolis|cenotáfio/.test(t)) return 'memorial';

  // Ruins & archaeological sites
  if (/ruína|ruinas|ruins|sítio arqueológico|sitio arqueologico|archaeological|arqueológico|arqueologico|vestígios|sítio histórico|sitio historico|sambaqui|rupestre/.test(t)) return 'ruins';

  // Battlefields & war events
  if (/campo de batalha|battlefield|batalha de |battle of |combate de |revolta de |revolução (de|do|da)|insurreição|guerra (civil|do|da|de)/.test(t)) return 'battlefield';

  // Stations, ports & transport infrastructure
  if (/\bestação\b|station|terminal (ferroviário|rodoviário|de passageiros)|metrô|metro\b|ferrovia|ferroviária|aeroporto|airport|\bporto de\b|\bcais\b|hidrovia/.test(t)) return 'station';

  // Universities & education
  if (/universidade|university|faculdade|faculty|\bcollege\b|liceu|academia de|instituto federal|escola politécnica|escola de (belas|artes|medicina|direito)|colégio estadual/.test(t)) return 'university';

  // Bridges & viaducts
  if (/\bponte\b|\bbridge\b|viaduto|viaduct|aqueduto|aqueduct|túnel histórico|tunel historico/.test(t)) return 'bridge';

  // Theaters & performance venues
  if (/teatro|theatre|theater|ópera|opera house|anfiteatro|amphith|sala de concertos|concert hall|cineteatro|casa de espetáculos/.test(t)) return 'theater';

  // Historic events & proclamations
  if (/proclamação|proclamation|tratado de |declaração de independência|declaration of independence|abolição|abolition|assinatura do/.test(t)) return 'event_site';

  // Palaces, government & civic buildings
  if (/palácio|palacio|palace|paço\b|pacos\b|prefeitura|câmara municipal|câmara dos|senado federal|tribunal de|governo do estado|governo de|sede do governo|ministério|ministerio|parliament|parlamento|intendência|intendencia|arsenal (de|da|do)/.test(t)) return 'monument';

  // Districts, neighborhoods & historic centers
  if (/\bbairro\b|\bdistrict\b|\bdistrito\b|vila histórica|vila operária|vila |vila$|centro histórico|centro historico|núcleo histórico|núcleo colonial|conjunto histórico|pelourinho/.test(t)) return 'district';

  // Plazas, gardens, monuments, statues
  if (/praça|square|plaza|\blargo\b|jardim (histórico|botânico|público)|parque histórico|parque nacional|parque estadual|monumento|monument|estátua|statue|obelisco|marco histórico|\bfonte\b (histórica|de)|coreto|chafariz|arco do|coluna de/.test(t)) return 'monument';

  // Noble houses, estates & historic buildings
  if (/solar (de|do|da)|engenho (de|do|da)|fazenda (histórica|velha|do|da)|sítio (do|da|de)\b|chácara|\bcasa grande\b|sobrado histórico|palacete/.test(t)) return 'historical_landmark';

  // Civic/cultural landmarks by keyword
  if (/mercado (municipal|histórico|público)|feira histórica|edifício (histórico|sede|central)|torre (histórica|do relógio)|relógio público|fórum|forum\b|hospedaria|alojamento histórico/.test(t)) return 'monument';

  return 'historical_landmark';
}

function App() {
  const [pins, setPins] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [story, setStory] = useState(null);
  const [storyError, setStoryError] = useState(false);
  const [loadingStory, setLoadingStory] = useState(false);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const storyAbortRef = useRef(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [locating, setLocating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lang, setLang] = useState('pt-BR');
  const [aiGuide, setAiGuide] = useState('historian');
  const [hiddenTypes, setHiddenTypes] = useState(new Set());
  const [scanCenter, setScanCenter] = useState(null);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('oh-theme') || 'light'; } catch { return 'light'; }
  });
  const darkMode = theme === 'dark' || theme === 'midnight';

  const [showAbout, setShowAbout] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return !localStorage.getItem('oh-onboarded'); } catch { return true; }
  });
  const handleOnboardingDone = useCallback(() => {
    try { localStorage.setItem('oh-onboarded', '1'); } catch {}
    setShowOnboarding(false);
  }, []);

  // Evaluated once at mount — good enough, the app is not resized mid-session
  const [isMobile] = useState(() => window.innerWidth < 640);

  const t = useT(lang);
  const viewCenterRef = useRef(null);

  const toggleType = useCallback((type) => {
    setHiddenTypes(prev => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => setHiddenTypes(new Set()), []);

  const selectTheme = useCallback((t) => {
    setTheme(t);
    try { localStorage.setItem('oh-theme', t); } catch {}
  }, []);

  const fetchNearby = useCallback(async (lat, lon) => {
    setScanCenter({ lat, lng: lon });
    setLoadingNearby(true);
    try {
      const localLang = toWikiLang(lang);
      const langList = localLang === 'en' ? ['en'] : ['en', localLang];

      const wikiSearch = async (wikiLang) => {
        const res = await axios.get(`https://${wikiLang}.wikipedia.org/w/api.php`, {
          params: { action: 'query', list: 'geosearch', gscoord: `${lat}|${lon}`, gsradius: 10000, gslimit: 50, format: 'json', origin: '*' },
        });
        return res.data?.query?.geosearch || [];
      };

      const results = await Promise.all(langList.map(l => wikiSearch(l).catch(() => [])));
      const [enPlaces, ...rest] = results;
      const localPlaces = rest[0] ?? [];

      const seen = new Set();
      const unique = [...localPlaces, ...enPlaces].filter(p => {
        if (seen.has(p.pageid)) return false;
        seen.add(p.pageid);
        return true;
      });

      const wikiPlaces = unique.map(p => ({
        id: String(p.pageid),
        name: cleanWikiTitle(p.title),
        lat: p.lat,
        lon: p.lon,
        type: inferTypeFromTitle(p.title),
      }));

      const nearbyWonders = SEVEN_WONDERS.filter(w => haversineKm(lat, lon, w.lat, w.lon) <= 50);
      const wikiFiltered = wikiPlaces.filter(
        p => !nearbyWonders.some(w => haversineKm(p.lat, p.lon, w.lat, w.lon) < 0.5)
      );

      const combined = [...nearbyWonders, ...wikiFiltered];
      setPins(isMobile ? combined.slice(0, 30) : combined);
    } catch (err) {
      console.error('Error fetching nearby', err);
    } finally {
      setLoadingNearby(false);
    }
  }, [lang]);

  const handleMapMove = useCallback((center) => {
    viewCenterRef.current = center;
  }, []);

  useEffect(() => {
    const center = viewCenterRef.current || mapCenter;
    if (center) fetchNearby(center.lat, center.lng);
  }, [lang]);

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

  const fetchStory = useCallback(async (pin) => {
    if (storyAbortRef.current) storyAbortRef.current.abort();
    const controller = new AbortController();
    storyAbortRef.current = controller;

    setSelectedPlace(pin);
    setLoadingStory(true);
    setStory(null);
    setStoryError(false);
    try {
      const res = await axios.get(`${API_BASE}/history/story`, {
        params: { name: pin.name, lat: pin.lat, lon: pin.lon, lang, aiGuide },
        signal: controller.signal,
      });
      setStory({ text: res.data.story, photo: res.data.photoUrl, wikiUrl: res.data.wikiUrl });
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error('Error fetching story', err);
      setStoryError(true);
    } finally {
      setLoadingStory(false);
    }
  }, [lang, aiGuide]);

  const handlePinClick = useCallback((pin) => {
    if (selectedPlace) { setSelectedPlace(null); setStory(null); }
  }, [selectedPlace]);

  const filteredPins = hiddenTypes.size === 0 ? pins : pins.filter(p => !hiddenTypes.has(p.type));

  const statusLabel = loadingNearby
    ? t.loadingNearby
    : pins.length === 0
      ? t.noPlaces
      : t.placesFound(filteredPins.length);

  // Shared settings content used in both desktop pill and mobile drawer
  const settingsContent = (
    <>
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
        <div className="settings-option-light">
          <div className="settings-option-label-light">
            <Moon size={18} className="settings-option-icon-light" />
            {t.settingsDarkMode}
          </div>
          <select
            className="settings-select-light"
            value={theme}
            onChange={(e) => selectTheme(e.target.value)}
          >
            <option value="light">{t.themeLight}</option>
            <option value="dark">{t.themeDark}</option>
            <option value="midnight">{t.themeMidnight}</option>
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

      <div>
        <span className="settings-section-title-light">{t.settingsFilters}</span>
        <div className="settings-type-chips" style={{ marginTop: 8 }}>
          {Object.keys(TYPE_COLORS).map((type) => {
            const hidden = hiddenTypes.has(type);
            return (
              <motion.button
                key={type}
                className={`settings-type-chip ${hidden ? 'is-hidden' : ''}`}
                onClick={() => toggleType(type)}
                whileTap={{ scale: 0.82 }}
                animate={hidden ? { x: [0, -4, 3, -2, 0] } : { x: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              >
                <span className="settings-type-dot" style={{ background: hidden ? '#d1d5db' : TYPE_COLORS[type] }} />
                {t.typeLabels?.[type] || type}
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
          {hiddenTypes.size > 0 && (
            <motion.div
              initial={false}
              animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              style={{ overflow: 'hidden' }}
            >
              <motion.button
                className="filters-clear-btn"
                onClick={clearFilters}
                style={{ width: '100%' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              >
                {t.clearFilters} ({hiddenTypes.size})
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="settings-bottom-actions">
        <button
          className="settings-onboarding-btn"
          onClick={() => { setShowOnboarding(true); setIsSettingsOpen(false); }}
        >
          {t.onboardingReopen}
        </button>
        <button
          className="settings-onboarding-btn"
          onClick={() => { setShowAbout(true); setIsSettingsOpen(false); }}
        >
          {t.settingsAbout}
        </button>
        <button
          className="settings-onboarding-btn"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
          onClick={() => { setShowDonate(true); setIsSettingsOpen(false); }}
        >
          <Heart size={15} />
          {t.donateBtn}
        </button>
        <button
          className="settings-onboarding-btn"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
          onClick={() => { setShowFeedback(true); setIsSettingsOpen(false); }}
        >
          <MessageSquare size={15} />
          {t.feedbackBtn}
        </button>
      </div>
    </>
  );

  return (
    <div className={`app-root${darkMode ? ' dark' : ''}${theme === 'midnight' ? ' midnight' : ''}`}>
      {isSettingsOpen && (
        <div className="settings-overlay" onClick={() => setIsSettingsOpen(false)} />
      )}
      <div className="app-header" style={isSettingsOpen ? { zIndex: 1100 } : undefined}>
        <motion.div
          layout
          className={`app-header-pill ${isSettingsOpen ? 'is-expanded' : ''}`}
          style={{ borderRadius: isSettingsOpen ? 24 : 999 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <motion.div layout className="app-header-row">
            <motion.img
              layout
              src={darkMode ? logoWhite : logoBlack}
              alt="Our History"
              className="app-logo"
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            />
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
              whileHover={{ scale: 1.1, rotate: isSettingsOpen ? 90 : 0 }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              {isSettingsOpen ? <X size={18} /> : <Settings size={18} />}
            </motion.button>
          </motion.div>

          {/* Settings expand inside the pill — same on mobile and desktop */}
          <AnimatePresence mode="popLayout">
            {isSettingsOpen && (
              <motion.div
                layout
                className="app-header-settings-content"
                initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ marginTop: 16, transformOrigin: "top center" }}
                onScroll={e => {
                  const el = e.currentTarget;
                  el.classList.add('is-scrolling');
                  clearTimeout(el._scrollTimer);
                  el._scrollTimer = setTimeout(() => el.classList.remove('is-scrolling'), 600);
                }}
              >
                {settingsContent}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <MapComponent
        externalCenter={mapCenter}
        pins={filteredPins}
        onPinClick={handlePinClick}
        userPosition={userPosition}
        onOpenStory={fetchStory}
        onMapMove={handleMapMove}
        selectedPlace={selectedPlace}
        lang={lang}
        scanCenter={scanCenter}
        darkMode={darkMode}
        theme={theme}
        loadingNearby={loadingNearby}
      />

      <SearchBar onLocationSelect={handleSearchSelect} lang={lang} />

      <div className="floating-dock-container">
        <div className="floating-dock">
          <button
            onClick={handleGoToUserLocation}
            className={`dock-btn-locate ${locating ? 'dock-btn-locating' : ''}`}
            aria-label={t.locate}
          >
            <Navigation size={20} />
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
        error={storyError}
        onRetry={() => selectedPlace && fetchStory(selectedPlace)}
        onClose={() => {
          if (storyAbortRef.current) storyAbortRef.current.abort();
          setSelectedPlace(null);
          setStory(null);
          setStoryError(false);
          setLoadingStory(false);
        }}
        lang={lang}
      />


      <div className="app-vignette" />

      <AnimatePresence>
        {loadingNearby && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeOut' } }}
            transition={{ duration: 0.25 }}
            style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 500 }}
          >
            <div className="scan-sweep" />
            <div className="scan-sweep-echo" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOnboarding && (
          <OnboardingOverlay onDone={handleOnboardingDone} lang={lang} darkMode={darkMode} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAbout && (
          <AboutModal onClose={() => setShowAbout(false)} darkMode={darkMode} lang={lang} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDonate && (
          <DonationModal onClose={() => setShowDonate(false)} darkMode={darkMode} lang={lang} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedback && (
          <FeedbackModal onClose={() => setShowFeedback(false)} darkMode={darkMode} lang={lang} apiBase={API_BASE} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

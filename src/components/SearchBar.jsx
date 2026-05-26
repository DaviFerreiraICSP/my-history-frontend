import { useState, useRef } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '../i18n';

export default function SearchBar({ onLocationSelect, lang = 'pt-BR' }) {
  const t = useT(lang);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const fetchSuggestions = (q) => {
    clearTimeout(debounceRef.current);
    if (!q.trim()) { setSuggestions([]); setLoading(false); return; }
    
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=pt-BR`;
        const res = await fetch(url, { headers: { 'User-Agent': 'OurHistoryApp/1.0' } });
        const data = await res.json();
        setSuggestions(data.slice(0, 5));
      } catch { /* silent */ }
      finally {
        setLoading(false);
      }
    }, 350);
  };

  const selectResult = (item) => {
    onLocationSelect({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
    setQuery('');
    setSuggestions([]);
    setExpanded(false);
    setNotFound(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    if (suggestions.length > 0) { selectResult(suggestions[0]); return; }
    setLoading(true);
    setNotFound(false);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&accept-language=pt-BR`;
      const res = await fetch(url, { headers: { 'User-Agent': 'OurHistoryApp/1.0' } });
      const data = await res.json();
      if (data.length > 0) selectResult(data[0]);
      else setNotFound(true);
    } catch (err) {
      console.error('Search error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setExpanded(true);
    setNotFound(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleClose = () => {
    setExpanded(false);
    setQuery('');
    setSuggestions([]);
    setNotFound(false);
  };

  const shortName = (display) => {
    const parts = display.split(',');
    return parts.slice(0, 2).join(',').trim();
  };

  return (
    <div className={`search-container ${expanded ? 'is-expanded' : ''}`}>
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="search-bar-expanded"
            initial={{ opacity: 0, scaleX: 0.7, originX: 1 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0.7, originX: 1 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <Search size={16} className="search-bar-icon" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setNotFound(false); fetchSuggestions(e.target.value); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t.searchPlaceholder}
              className="search-input"
            />
            {query && (
              <button className="search-clear" onClick={() => { setQuery(''); setSuggestions([]); setNotFound(false); inputRef.current?.focus(); }}>
                <X size={13} />
              </button>
            )}
            <button className="search-go" onClick={loading ? undefined : handleSearch} aria-label="Buscar">
              {loading
                ? <div className="search-spinner" />
                : <Search size={15} />
              }
            </button>

            <AnimatePresence>
              {(suggestions.length > 0 || notFound) && (
                <motion.div
                  className="search-suggestions"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  {notFound && (
                    <div className="search-suggestion-empty">{t.notFound}</div>
                  )}
                  {suggestions.map((s) => (
                    <button key={s.place_id} className="search-suggestion-item" onClick={() => selectResult(s)}>
                      <MapPin size={13} className="search-suggestion-icon" />
                      <span>{shortName(s.display_name)}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layout
        className="search-pill"
        onClick={expanded ? handleClose : handleOpen}
        aria-label={expanded ? "Fechar busca" : "Buscar"}
        initial={false}
        animate={{ rotate: expanded ? 90 : 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      >
        {expanded ? <X size={16} /> : <Search size={18} />}
      </motion.button>
    </div>
  );
}

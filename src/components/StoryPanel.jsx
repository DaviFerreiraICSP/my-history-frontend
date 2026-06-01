import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ImageOff, ExternalLink, Navigation2, Car, Compass, WifiOff, RotateCcw } from 'lucide-react';
import { useT } from '../i18n';

export default function StoryPanel({ selectedPlace, story, onClose, loading, error = false, onRetry, lang = 'pt-BR' }) {
  const t = useT(lang);
  const storyText = typeof story === 'object' ? story?.text : story;
  const photoUrl  = typeof story === 'object' ? story?.photo : null;
  const wikiUrl   = typeof story === 'object' ? story?.wikiUrl : null;

  const [imgStatus, setImgStatus] = useState('idle');
  useEffect(() => {
    setImgStatus(photoUrl ? 'loading' : 'idle');
  }, [photoUrl]);

  const formatText = (text) => {
    if (!text) return [];
    return text.split(/\n\n+/).filter(p => p.trim()).map(para => {
      const parts = para.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} style={{ color: '#111827', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
          : part
      );
    });
  };

  const paragraphs = formatText(storyText);
  const typeLabel = t.typeLabels[selectedPlace?.type] || t.typeLabels.historical_landmark;

  return (
    <AnimatePresence>
      {(selectedPlace || loading) && (
        <motion.div
          layoutId={selectedPlace ? `story-card-${selectedPlace.id}` : undefined}
          className="story-panel"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 1 }}
        >
          {/* Hero image */}
          <div className="story-hero">
            {/* Drag handle — floats over image on mobile */}
            <div className="story-drag-handle" />
            {photoUrl ? (
              <>
                {imgStatus !== 'loaded' && imgStatus !== 'error' && (
                  <div className="story-hero-img-shimmer" />
                )}
                {imgStatus === 'error' ? (
                  <div className="story-hero-placeholder story-hero-no-img">
                    <ImageOff size={32} strokeWidth={1.5} />
                    <span>{t.imgError || 'Imagem indisponível'}</span>
                  </div>
                ) : (
                  <img
                    src={photoUrl}
                    alt={selectedPlace?.name}
                    className="story-hero-img"
                    style={{ opacity: imgStatus === 'loaded' ? 1 : 0, transition: 'opacity 0.4s ease' }}
                    onLoad={() => setImgStatus('loaded')}
                    onError={() => setImgStatus('error')}
                  />
                )}
              </>
            ) : loading ? (
              <div className="story-hero-placeholder">
                <Sparkles size={40} style={{ color: '#c4b5fd', animation: 'sparkleFloat 2s ease-in-out infinite' }} />
              </div>
            ) : (
              <div className="story-hero-placeholder story-hero-no-img">
                <ImageOff size={32} strokeWidth={1.5} />
                <span>{t.imgNotFound || 'Sem imagem disponível'}</span>
              </div>
            )}
            <div className="story-hero-fade" />
            <motion.button
              className="story-close-btn"
              onClick={onClose}
              aria-label="Fechar"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              <X size={16} style={{ color: '#374151' }} />
            </motion.button>
          </div>


          {/* Header */}
          <div className="story-header">
            {loading ? (
              <div className="story-skeleton story-skeleton-title" />
            ) : (
              <h2 className="story-title">{selectedPlace?.name}</h2>
            )}
            <div className="story-header-meta">
              <span className="story-type">
                {loading ? (
                  <span className="loading-dots">
                    <span /><span /><span />
                  </span>
                ) : typeLabel}
              </span>
              {!loading && wikiUrl && (
                <a href={wikiUrl} target="_blank" rel="noopener noreferrer" className="story-wiki-top-link">
                  <ExternalLink size={11} />
                  Wikipedia
                </a>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="story-body">
            {error ? (
              <div className="story-error">
                <div className="story-error-icon">
                  <WifiOff size={28} />
                </div>
                <h3 className="story-error-title">{t.errorTitle}</h3>
                <p className="story-error-desc">{t.errorDesc}</p>
                <button className="story-error-retry" onClick={onRetry}>
                  <RotateCcw size={15} />
                  {t.errorRetry}
                </button>
              </div>
            ) : loading ? (
              <div className="story-loading-skeletons">
                {[100, 85, 100, 70, 95, 60].map((w, i) => (
                  <div key={i} className="story-skeleton" style={{ width: `${w}%`, animationDelay: `${i * 0.12}s` }} />
                ))}
              </div>
            ) : (
              <>
                {paragraphs.length > 0 ? paragraphs.map((para, idx) => (
                  <p key={idx} className="story-paragraph">{para}</p>
                )) : (
                  <p className="story-empty">{t.noStory}</p>
                )}

                {selectedPlace?.lat && selectedPlace?.lon && (
                  <div className="story-directions">
                    <span className="story-directions-label">{t.directions}</span>
                    <div className="story-directions-buttons">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lon}`}
                        target="_blank" rel="noopener noreferrer"
                        className="story-nav-btn story-nav-google"
                      >
                        <Navigation2 size={14} />
                        Google Maps
                      </a>
                      <a
                        href={`https://waze.com/ul?ll=${selectedPlace.lat},${selectedPlace.lon}&navigate=yes`}
                        target="_blank" rel="noopener noreferrer"
                        className="story-nav-btn story-nav-waze"
                      >
                        <Car size={14} />
                        Waze
                      </a>
                      <a
                        href={`https://maps.apple.com/?daddr=${selectedPlace.lat},${selectedPlace.lon}`}
                        target="_blank" rel="noopener noreferrer"
                        className="story-nav-btn story-nav-apple"
                      >
                        <Compass size={14} />
                        Apple Maps
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Sparkles, ImageOff, ExternalLink, WifiOff, RotateCcw, Crown } from 'lucide-react';

const reveal = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
import { useT } from '../i18n';
import { GoogleMapsIcon, WazeIcon, AppleMapsIcon } from './BrandIcons';

export default function StoryPanel({ selectedPlace, story, onClose, loading, error = false, onRetry, lang = 'pt-BR' }) {
  const t = useT(lang);
  const storyText = typeof story === 'object' ? story?.text : story;
  const photoUrl  = typeof story === 'object' ? story?.photo : null;
  const wikiUrl   = typeof story === 'object' ? story?.wikiUrl : null;

  const isWonder = selectedPlace?.type === 'wonder';
  const dragControls = useDragControls();

  const [imgStatus, setImgStatus] = useState('idle');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setImgStatus(photoUrl ? 'loading' : 'idle');
  }, [photoUrl]);

  useEffect(() => {
    setIsExpanded(false);
  }, [selectedPlace?.id]);

  const cleanStoryText = (raw) => {
    if (!raw) return '';
    const patterns = [
      /\(?\s*,?\s*(?:situad[ao]|localizad[ao]|posicionad[ao]|local)?\s*(?:nas|pelas|sob as)?\s*coordenadas(?:\s+geográficas)?(?:\s+de)?\s*[-+]?\d+\.\d+[\s,;e/]+[-+]?\d+\.\d+\s*\)?\s*,?/gi,
      /\(?\s*coordenadas:\s*[-+]?\d+\.\d+[\s,;e/]+[-+]?\d+\.\d+\s*\)?\s*,?/gi,
      /\(?\s*(?:lat|latitude)[:\s]*[-+]?\d+\.\d+[\s,;e/]+(?:lon|long|longitude)[:\s]*[-+]?\d+\.\d+\s*\)?\s*,?/gi,
      /\(?\s*[-+]?\d{1,3}\.\d{3,}[\s,;e/]+[-+]?\d{1,3}\.\d{3,}\s*\)?\s*,?/gi,
    ];
    let res = raw;
    for (const p of patterns) {
      res = res.replace(p, '');
    }
    return res
      .replace(/\s{2,}/g, ' ')
      .replace(/([A-Za-zÀ-ÿ0-9])\s*,\s*,/g, '$1,')
      .replace(/^\s*,\s*/gm, '')
      .trim();
  };

  const formatText = (text) => {
    if (!text) return [];
    const cleaned = cleanStoryText(text);
    return cleaned.split(/\n\n+/).filter(p => p.trim()).map(para => {
      const parts = para.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} style={{ color: 'inherit', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
          : part
      );
    });
  };

  const paragraphs = formatText(storyText);
  const MAX_PARAS = 2;
  const hasMore = paragraphs.length > MAX_PARAS;
  const visibleParagraphs = isExpanded ? paragraphs : paragraphs.slice(0, MAX_PARAS);
  const typeLabel = t.typeLabels[selectedPlace?.type] || t.typeLabels.historical_landmark;

  return (
    <AnimatePresence>
      {(selectedPlace || loading) && (
        <motion.div
          layoutId={selectedPlace ? `story-card-${selectedPlace.id}` : undefined}
          className={`story-panel${isWonder ? ' story-panel-wonder' : ''}`}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 1 }}
          drag="y"
          dragControls={dragControls}
          dragListener={false}
          dragConstraints={{ top: 0 }}
          dragElastic={{ top: 0, bottom: 0.25 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 80 || info.velocity.y > 400) onClose();
          }}
        >
          {/* Hero image */}
          <div
            className="story-hero"
            onPointerDown={(e) => dragControls.start(e)}
            style={{ touchAction: 'none' }}
          >
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
              <motion.h2
                key={selectedPlace?.id + '_title'}
                className={`story-title${isWonder ? ' story-title-wonder' : ''}`}
                variants={reveal}
                initial="hidden"
                animate="visible"
              >
                {selectedPlace?.name}
              </motion.h2>
            )}
            <div className="story-header-meta">
              <span className={`story-type${isWonder ? ' story-type-wonder' : ''}`}>
                {loading ? (
                  <span className="loading-dots">
                    <span /><span /><span />
                  </span>
                ) : isWonder ? (
                  <>
                    <Crown size={11} strokeWidth={2.5} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                    {typeLabel}
                    <Sparkles size={10} strokeWidth={2} style={{ display: 'inline', marginLeft: 3, verticalAlign: 'middle' }} />
                  </>
                ) : typeLabel}
              </span>
              {!loading && wikiUrl && (
                <motion.a
                  key={selectedPlace?.id + '_wiki'}
                  href={wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="story-wiki-top-link"
                  variants={reveal}
                  initial="hidden"
                  animate="visible"
                >
                  <ExternalLink size={11} />
                  Wikipedia
                </motion.a>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="story-body">
            {error ? (
              <motion.div
                className="story-error"
                variants={reveal}
                initial="hidden"
                animate="visible"
              >
                <div className="story-error-icon">
                  <WifiOff size={28} />
                </div>
                <h3 className="story-error-title">{t.errorTitle}</h3>
                <p className="story-error-desc">{t.errorDesc}</p>
                <button className="story-error-retry" onClick={onRetry}>
                  <RotateCcw size={15} />
                  {t.errorRetry}
                </button>
              </motion.div>
            ) : loading ? (
              <div className="story-loading-skeletons">
                {[100, 85, 100, 70, 95, 60].map((w, i) => (
                  <div key={i} className="story-skeleton" style={{ width: `${w}%`, animationDelay: `${i * 0.12}s` }} />
                ))}
              </div>
            ) : (
              <motion.div
                key={selectedPlace?.id + '_content'}
                variants={stagger}
                initial="hidden"
                animate="visible"
                style={{ display: 'contents' }}
              >
                {visibleParagraphs.length > 0 ? visibleParagraphs.map((para, idx) => (
                  <motion.p key={idx} className="story-paragraph" variants={reveal}>
                    {para}
                  </motion.p>
                )) : (
                  <motion.p className="story-empty" variants={reveal}>{t.noStory}</motion.p>
                )}

                {hasMore && (
                  <motion.button
                    variants={reveal}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="story-expand-btn"
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? (t.showLess || 'Mostrar menos') : (t.readMore || 'Ler mais')}
                  </motion.button>
                )}

                {selectedPlace?.lat && selectedPlace?.lon && (
                  <motion.div className="story-directions" variants={reveal}>
                    <span className="story-directions-label">{t.directions}</span>
                    <div className="story-directions-buttons">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lon}`}
                        target="_blank" rel="noopener noreferrer"
                        className="story-nav-btn story-nav-google"
                      >
                        <GoogleMapsIcon size={16} />
                        Google Maps
                      </a>
                      <a
                        href={`https://waze.com/ul?ll=${selectedPlace.lat},${selectedPlace.lon}&navigate=yes`}
                        target="_blank" rel="noopener noreferrer"
                        className="story-nav-btn story-nav-waze"
                      >
                        <WazeIcon size={16} />
                        Waze
                      </a>
                      <a
                        href={`https://maps.apple.com/?daddr=${selectedPlace.lat},${selectedPlace.lon}`}
                        target="_blank" rel="noopener noreferrer"
                        className="story-nav-btn story-nav-apple"
                      >
                        <AppleMapsIcon size={16} />
                        Apple Maps
                      </a>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

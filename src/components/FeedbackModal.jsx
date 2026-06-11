import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { useT } from '../i18n';

export default function FeedbackModal({ onClose, darkMode, lang, apiBase }) {
  const t = useT(lang);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const displayRating = hovered || rating;

  const handleSubmit = async () => {
    if (rating === 0) return;
    setStatus('loading');
    try {
      await fetch(`${apiBase}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, message: message.trim(), lang }),
      });
      setStatus('success');
      setTimeout(() => onClose(), 1500);
    } catch {
      setStatus('error');
    }
  };

  return (
    <motion.div
      className={`about-overlay${darkMode ? ' dark' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.08 } }}
      transition={{ duration: 0.22 }}
      onClick={status !== 'loading' ? onClose : undefined}
    >
      <motion.div
        className="feedback-modal-card"
        initial={{ opacity: 0, scale: 0.92, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{
          opacity: [1, 1, 0],
          scale: [1, 1.04, 0.82],
          y: [0, 6, -48],
          filter: ['blur(0px)', 'blur(0px)', 'blur(10px)'],
          transition: { duration: 0.38, ease: 'easeIn', times: [0, 0.18, 1] },
        }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
      >
        <motion.button
          className="about-close-btn"
          onClick={onClose}
          aria-label="Fechar"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          disabled={status === 'loading'}
        >
          <X size={16} />
        </motion.button>

        <div className="feedback-modal-header">
          <h2 className="feedback-modal-title">{t.feedbackTitle}</h2>
          <p className="feedback-modal-subtitle">{t.feedbackSubtitle}</p>
        </div>

        {/* Stars */}
        <div
          className="feedback-stars"
          onMouseLeave={() => setHovered(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              className={`feedback-star${displayRating >= star ? ' is-filled' : ''}`}
              onMouseEnter={() => setHovered(star)}
              onClick={() => setRating(star)}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
              disabled={status === 'loading' || status === 'success'}
            >
              <Star size={32} />
            </motion.button>
          ))}
        </div>

        {/* Textarea */}
        <div className="feedback-modal-textarea-wrap">
          <textarea
            className="feedback-modal-textarea"
            placeholder={t.feedbackPlaceholder}
            value={message}
            onChange={e => setMessage(e.target.value.slice(0, 500))}
            rows={3}
            disabled={status === 'loading' || status === 'success'}
          />
          <span className="feedback-modal-chars">{t.feedbackChars(message.length)}</span>
        </div>

        {/* Status messages */}
        <AnimatePresence mode="wait">
          {status === 'error' && (
            <motion.p
              key="error"
              className="feedback-modal-status feedback-modal-status--error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {t.feedbackError}
            </motion.p>
          )}
          {status === 'success' && (
            <motion.p
              key="success"
              className="feedback-modal-status feedback-modal-status--success"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {t.feedbackSuccess}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <motion.button
          className={`feedback-modal-submit${rating === 0 ? ' is-disabled' : ''}`}
          onClick={handleSubmit}
          disabled={rating === 0 || status === 'loading' || status === 'success'}
          whileHover={rating > 0 && status === 'idle' ? { scale: 1.02 } : {}}
          whileTap={rating > 0 && status === 'idle' ? { scale: 0.97 } : {}}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        >
          {status === 'loading' ? (
            <span className="feedback-modal-spinner" />
          ) : null}
          {status === 'loading' ? t.feedbackSending : t.feedbackSend}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

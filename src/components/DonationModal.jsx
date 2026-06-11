import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Coffee } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useT } from '../i18n';

const PIX_KEY = '4e5ae082-ad90-4277-a73f-1b598f42dc3f';

export default function DonationModal({ onClose, darkMode, lang }) {
  const t = useT(lang);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PIX_KEY).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      className={`about-overlay${darkMode ? ' dark' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.08 } }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
    >
      <motion.div
        className="donate-modal-card"
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
        >
          <X size={16} />
        </motion.button>

        {/* Header */}
        <div className="donate-modal-header">
          <div className="donate-modal-icon">
            <Heart size={28} />
          </div>
          <h2 className="donate-modal-title">{t.donateTitle}</h2>
          <p className="donate-modal-desc">{t.donateDesc}</p>
        </div>

        <div className="about-divider" style={{ width: '100%' }} />

        {/* Pix Section */}
        <div className="donate-modal-section">
          <div className="donate-modal-section-header">
            <span className="donate-modal-section-title">{t.donatePix}</span>
          </div>
          <div className="donate-modal-qr">
            <QRCodeSVG
              value={PIX_KEY}
              size={148}
              bgColor="transparent"
              fgColor={darkMode ? '#F9FAFB' : '#111827'}
              level="M"
            />
          </div>
          <div className="donate-modal-pix-key-row">
            <span className="donate-modal-pix-label">{t.donatePixKey}</span>
            <span className="donate-modal-pix-value">{PIX_KEY.slice(0, 8)}…</span>
          </div>
          <motion.button
            className={`donate-modal-copy-btn${copied ? ' is-copied' : ''}`}
            onClick={handleCopy}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            {copied ? t.donateCopied : t.donateCopy}
          </motion.button>
        </div>

        <div className="about-divider" style={{ width: '100%' }} />

        {/* Ko-fi Section */}
        <div className="donate-modal-section donate-modal-section--soon">
          <div className="donate-modal-section-header">
            <Coffee size={16} className="donate-modal-section-icon" />
            <span className="donate-modal-section-title">{t.donateKofi}</span>
          </div>
          <span className="donate-modal-soon-badge">{t.donateKofiSoon}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

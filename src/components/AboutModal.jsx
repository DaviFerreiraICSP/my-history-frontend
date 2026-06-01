import { motion } from 'framer-motion';
import { X, Shield, ExternalLink } from 'lucide-react';
import logoBlack from '../assets/our_history_black.png';
import logoWhite from '../assets/our_history_white.png';
import { useT } from '../i18n';

const APP_VERSION = '1.0.0';

export default function AboutModal({ onClose, darkMode, lang }) {
  const t = useT(lang);

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
        className="about-card"
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
        <div className="about-header">
          <img
            src={darkMode ? logoWhite : logoBlack}
            alt="Our History"
            className="about-logo"
          />
          <h2 className="about-app-name">Our History</h2>
          <span className="about-version">v{APP_VERSION}</span>
        </div>

        <p className="about-desc">{t.aboutDesc}</p>

        <div className="about-divider" />

        <div className="about-row">
          <span className="about-row-label">{t.aboutDeveloper}</span>
          <span className="about-row-value">Davi Ferreira</span>
        </div>

        <div className="about-divider" />

        <div className="about-links">
          <a
            href="/privacy.html"
            className="about-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Shield size={15} />
            {t.aboutPrivacy}
          </a>
          <a
            href="https://www.linkedin.com/in/davi-ferreira-6229a6218/"
            className="about-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={15} />
            LinkedIn
          </a>
        </div>

        <p className="about-made-with">Made with ♥ in Brazil</p>
      </motion.div>
    </motion.div>
  );
}

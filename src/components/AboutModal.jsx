import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, ExternalLink } from 'lucide-react';
import logoBlack from '../assets/logo-black.png';
import logoWhite from '../assets/logo-white.png';
import { useT } from '../i18n';

const APP_VERSION = '1.0.0';

export default function AboutModal({ onClose, darkMode, lang }) {
  const t = useT(lang);

  return (
    <div className={`about-overlay${darkMode ? ' dark' : ''}`} onClick={onClose}>
      <motion.div
        className="about-card"
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="about-close-btn" onClick={onClose} aria-label="Fechar">
          <X size={16} />
        </button>

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

        {/* Developer */}
        <div className="about-row">
          <span className="about-row-label">{t.aboutDeveloper}</span>
          <span className="about-row-value">Davi Ferreira</span>
        </div>

        <div className="about-divider" />

        {/* Links */}
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
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Navigation2 } from 'lucide-react';
import logoBlack from '../assets/logo-black.png';
import logoWhite from '../assets/logo-white.png';
import { useT } from '../i18n';

const TOTAL = 3;

export default function OnboardingOverlay({ onDone, lang, darkMode }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const t = useT(lang);

  const goNext = () => {
    if (step < TOTAL - 1) { setDir(1); setStep(s => s + 1); }
    else onDone();
  };

  const slides = [
    {
      illustration: (
        <div className="onboarding-logo-wrap">
          <img src={darkMode ? logoWhite : logoBlack} alt="Our History" className="onboarding-logo" />
        </div>
      ),
      title: t.onboarding1Title,
      desc: t.onboarding1Desc,
    },
    {
      illustration: (
        <div className="onboarding-icon-wrap">
          <Map size={50} color="white" strokeWidth={1.5} />
        </div>
      ),
      title: t.onboarding2Title,
      desc: t.onboarding2Desc,
    },
    {
      illustration: (
        <div className="onboarding-icon-wrap">
          <Navigation2 size={50} color="white" strokeWidth={1.5} />
        </div>
      ),
      title: t.onboarding3Title,
      desc: t.onboarding3Desc,
    },
  ];

  const slide = slides[step];
  const isLast = step === TOTAL - 1;

  return (
    <div className={`onboarding-overlay${darkMode ? ' dark' : ''}`}>
      <div className="onboarding-card">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -48 }}
            transition={{ duration: 0.26, ease: 'easeInOut' }}
            className="onboarding-slide"
          >
            <div className="onboarding-illustration">{slide.illustration}</div>
            <h2 className="onboarding-title">{slide.title}</h2>
            <p className="onboarding-desc">{slide.desc}</p>
          </motion.div>
        </AnimatePresence>

        <div className="onboarding-dots">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <span key={i} className={`onboarding-dot${i === step ? ' is-active' : ''}`} />
          ))}
        </div>

        <button className="onboarding-btn-primary" onClick={goNext}>
          {isLast ? t.onboardingStart : t.onboardingNext}
        </button>

        {!isLast && (
          <button className="onboarding-btn-skip" onClick={onDone}>
            {t.onboardingSkip}
          </button>
        )}
      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Navigation2 } from 'lucide-react';
import logoWhite from '../assets/our_history_white.png';
import logoBlack from '../assets/our_history_black.png';
import { useT } from '../i18n';

const TOTAL = 3;

const DARK_GRADIENTS = [
  'linear-gradient(160deg, #1a0533 0%, #2d1257 55%, #0f0a1e 100%)',
  'linear-gradient(160deg, #0a1628 0%, #0f2a50 55%, #080d17 100%)',
  'linear-gradient(160deg, #0f1219 0%, #1c2a40 55%, #080d12 100%)',
];

const LIGHT_GRADIENTS = [
  'linear-gradient(160deg, #f5f0ff 0%, #ede9fe 55%, #faf5ff 100%)',
  'linear-gradient(160deg, #eff6ff 0%, #dbeafe 55%, #f0f9ff 100%)',
  'linear-gradient(160deg, #f0f4ff 0%, #e0e7ff 55%, #f8faff 100%)',
];

export default function OnboardingOverlay({ onDone, lang, darkMode }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [launching, setLaunching] = useState(false);
  const t = useT(lang);
  const touchStartX = useRef(null);

  const gradients = darkMode ? DARK_GRADIENTS : LIGHT_GRADIENTS;
  const iconColor = darkMode ? 'white' : '#4C1D95';
  const logo = darkMode ? logoWhite : logoBlack;

  const goTo = (next, direction) => {
    if (launching) return;
    if (next < 0) return;
    if (next >= TOTAL) {
      handleLaunch();
      return;
    }
    setDir(direction);
    setStep(next);
  };

  const handleLaunch = () => {
    setLaunching(true);
    setTimeout(onDone, 750);
  };

  const handleTap = (e) => {
    if (launching) return;
    const x = e.clientX;
    const w = window.innerWidth;
    if (x < w * 0.35) goTo(step - 1, -1);
    else goTo(step + 1, 1);
  };

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (launching) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) dx < 0 ? goTo(step + 1, 1) : goTo(step - 1, -1);
  };

  const slides = [
    {
      illustration: <img src={logo} alt="Our History" className="onboarding-story-logo" />,
      title: t.onboarding1Title,
      desc: t.onboarding1Desc,
    },
    {
      illustration: (
        <div className={`onboarding-story-icon${darkMode ? '' : ' light'}`}>
          <Map size={72} color={iconColor} strokeWidth={1.2} />
        </div>
      ),
      title: t.onboarding2Title,
      desc: t.onboarding2Desc,
    },
    {
      illustration: (
        <div className={`onboarding-story-icon${darkMode ? '' : ' light'}`}>
          <Navigation2 size={72} color={iconColor} strokeWidth={1.2} />
        </div>
      ),
      title: t.onboarding3Title,
      desc: t.onboarding3Desc,
    },
  ];

  const slide = slides[step];
  const isLast = step === TOTAL - 1;

  return (
    <motion.div
      className={`onboarding-story-overlay${darkMode ? '' : ' light'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, background: gradients[step] }}
      exit={{
        opacity: 0,
        scale: 1.12,
        filter: 'blur(28px) brightness(1.6)',
        transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
      }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
      style={{ background: gradients[0] }}
      onClick={handleTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Launch burst — expands from center when finishing */}
      <AnimatePresence>
        {launching && (
          <motion.div
            className="onboarding-launch-burst"
            initial={{ scale: 0, opacity: 0.85 }}
            animate={{ scale: 5, opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.2, 0, 0.4, 1] }}
            style={{
              background: darkMode
                ? 'radial-gradient(circle, rgba(167,139,250,0.9) 0%, rgba(109,40,217,0.4) 40%, transparent 70%)'
                : 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(167,139,250,0.5) 40%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="onboarding-story-progress">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div key={i} className="onboarding-story-segment">
            <motion.div
              className="onboarding-story-fill"
              animate={{ scaleX: launching || i <= step ? 1 : 0 }}
              transition={{ duration: i === step ? 0.25 : 0.2, ease: 'easeOut' }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
        ))}
      </div>

      {/* Illustration */}
      <div className="onboarding-story-illus">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, scale: 0.8, x: dir * 80 }}
            animate={{
              opacity: launching ? 0 : 1,
              scale: launching ? 1.3 : 1,
              x: 0,
              filter: launching ? 'blur(8px)' : 'blur(0px)',
            }}
            exit={{ opacity: 0, scale: 0.9, x: dir * -60 }}
            transition={{ duration: launching ? 0.45 : 0.38, ease: [0.32, 0.72, 0, 1] }}
          >
            {slide.illustration}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text + buttons */}
      <div className="onboarding-story-body" onClick={e => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: launching ? 0 : 1, y: launching ? -20 : 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <h2 className="onboarding-story-title">{slide.title}</h2>
            <p className="onboarding-story-desc">{slide.desc}</p>
          </motion.div>
        </AnimatePresence>

        <motion.button
          className="onboarding-story-btn"
          onClick={() => isLast ? handleLaunch() : goTo(step + 1, 1)}
          animate={launching ? { scale: [1, 1.06, 0.96], opacity: [1, 1, 0] } : {}}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          whileTap={{ scale: 0.97 }}
        >
          {isLast ? t.onboardingStart : t.onboardingNext}
        </motion.button>

        {!isLast && (
          <button className="onboarding-story-skip" onClick={onDone}>
            {t.onboardingSkip}
          </button>
        )}
      </div>
    </motion.div>
  );
}

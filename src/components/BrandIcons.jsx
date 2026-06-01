export function GoogleMapsIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pin body */}
      <path d="M24 4C15.16 4 8 11.16 8 20c0 11.9 16 28 16 28S40 31.9 40 20C40 11.16 32.84 4 24 4z" fill="#EA4335"/>
      {/* Inner circle — white ring */}
      <circle cx="24" cy="20" r="8.5" fill="white"/>
      {/* G color dots */}
      <circle cx="24" cy="11.5" r="3" fill="#4285F4"/>
      <circle cx="32.5" cy="24" r="3" fill="#34A853"/>
      <circle cx="15.5" cy="24" r="3" fill="#FBBC05"/>
      <circle cx="24" cy="20" r="3.5" fill="#EA4335"/>
    </svg>
  );
}

export function WazeIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="24" cy="24" rx="18" ry="17" fill="#33CCFF"/>
      {/* Left eye white */}
      <ellipse cx="17" cy="20" rx="5" ry="5.5" fill="white"/>
      {/* Right eye white */}
      <ellipse cx="31" cy="20" rx="5" ry="5.5" fill="white"/>
      {/* Left pupil */}
      <circle cx="18" cy="21" r="2.5" fill="#1A1A2E"/>
      {/* Right pupil */}
      <circle cx="32" cy="21" r="2.5" fill="#1A1A2E"/>
      {/* Smile */}
      <path d="M16 30 Q24 37 32 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Horn */}
      <path d="M31 8 Q36 3 40 7 Q37 13 32 13 Z" fill="#FF9900"/>
    </svg>
  );
}

export function AppleMapsIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Map background */}
      <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#appleMapGrad)"/>
      {/* Road horizontal */}
      <rect x="4" y="21" width="40" height="6" fill="white" opacity="0.9"/>
      {/* Road vertical */}
      <rect x="21" y="4" width="6" height="40" fill="white" opacity="0.9"/>
      {/* Intersection center */}
      <rect x="21" y="21" width="6" height="6" fill="white"/>
      {/* Navigation arrow */}
      <path d="M24 13 L28 22 L24 20 L20 22 Z" fill="#FF3B30"/>
      <defs>
        <linearGradient id="appleMapGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#48BB78"/>
          <stop offset="100%" stopColor="#276749"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

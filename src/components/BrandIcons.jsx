import googleMapsLogo from '../assets/googlemaps.svg';
import wazeLogo from '../assets/waze.svg';
import appleMapsLogo from '../assets/applemaps.png';

export function GoogleMapsIcon({ size = 18 }) {
  return (
    <img
      src={googleMapsLogo}
      width={size}
      height={size}
      alt="Google Maps"
      style={{ objectFit: 'contain', display: 'block', flexShrink: 0 }}
    />
  );
}

export function WazeIcon({ size = 18 }) {
  return (
    <img
      src={wazeLogo}
      width={size}
      height={size}
      alt="Waze"
      style={{ objectFit: 'contain', display: 'block', flexShrink: 0 }}
    />
  );
}

export function AppleMapsIcon({ size = 18 }) {
  return (
    <img
      src={appleMapsLogo}
      width={size}
      height={size}
      alt="Apple Maps"
      style={{ objectFit: 'contain', display: 'block', flexShrink: 0, borderRadius: '4px' }}
    />
  );
}

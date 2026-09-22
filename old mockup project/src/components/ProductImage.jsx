import {
  PiRocketLaunch,
  PiCamera,
  PiGameController,
  PiBriefcase,
  PiAirplaneTilt,
  PiHeadphones,
  PiPlugCharging,
  PiBatteryChargingVertical,
  PiWatch,
  PiKeyboard,
  PiSpeakerHigh,
  PiLaptop,
  PiUsb,
  PiCube,
} from 'react-icons/pi'

const ICONS = {
  rocket: PiRocketLaunch,
  camera: PiCamera,
  gamepad: PiGameController,
  briefcase: PiBriefcase,
  plane: PiAirplaneTilt,
  earbuds: PiHeadphones,
  charger: PiPlugCharging,
  battery: PiBatteryChargingVertical,
  watch: PiWatch,
  keyboard: PiKeyboard,
  speaker: PiSpeakerHigh,
  laptop: PiLaptop,
  hub: PiUsb,
}

/**
 * Shows a real product photo when `src` is provided, otherwise a styled
 * gradient placeholder with an icon — drop real photos in later without
 * changing any layout code.
 */
export default function ProductImage({ src, alt, icon, className = '' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
      />
    )
  }

  const Icon = ICONS[icon] || PiCube

  return (
    <div
      className={`bg-grid flex h-full w-full items-center justify-center bg-linear-to-br from-brand-100 to-brand-200 ${className}`}
      role="img"
      aria-label={alt}
    >
      <Icon className="glow-text-blue h-12 w-12 text-brand-400" strokeWidth={1.5} />
    </div>
  )
}

// Small inline SVG icon set (stroke-based, inherits currentColor) used in
// place of the original's icon-font glyphs across Contact and Our Work.

type IconProps = { className?: string };

export function PhoneIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path
        d="M4 5c0-1 1-2 2-2h2l2 5-2 1.5a11 11 0 0 0 5.5 5.5L15 13l5 2v2c0 1-1 2-2 2C10 19 4 13 4 5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ClockIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MailIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MapPinIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path
        d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function MapIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path
        d="m9 4-5 2v14l5-2 6 2 5-2V4l-5 2-6-2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 4v14M15 6v14" strokeLinecap="round" />
    </svg>
  );
}

export function TruckIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M3 7h10v9H3z" strokeLinejoin="round" />
      <path d="M13 11h4l3 3v2h-7z" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </svg>
  );
}

export function RoadIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M7 3 4 21M17 3l3 18" strokeLinecap="round" />
      <path d="M12 4v3M12 11v3M12 18v3" strokeLinecap="round" />
    </svg>
  );
}

export function BuildingIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="4" y="3" width="10" height="18" />
      <rect x="14" y="9" width="6" height="12" />
      <path d="M7 7h1M10 7h1M7 11h1M10 11h1M7 15h1M10 15h1" strokeLinecap="round" />
    </svg>
  );
}

export function GaugeIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M4 15a8 8 0 1 1 16 0" strokeLinecap="round" />
      <path d="M12 15 16 9" strokeLinecap="round" />
      <path d="M4 15h16" strokeLinecap="round" />
    </svg>
  );
}

export function BagIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}

export function UsersIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15.5 12c2.5 0 4.5 1.8 4.5 4.5" strokeLinecap="round" />
    </svg>
  );
}

export function DollarIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6.5v11M15 9.2c0-1.2-1.3-2.2-3-2.2s-3 .9-3 2.1c0 3 6 1.4 6 4.3 0 1.3-1.3 2.3-3 2.3s-3-1-3-2.3" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PdfIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M6 2h8l4 4v16H6Z" strokeLinejoin="round" />
      <path d="M14 2v4h4" strokeLinejoin="round" />
      <path d="M8.5 17.5v-4h1.2a1.2 1.2 0 1 1 0 2.4H8.5M12.5 17.5v-4h1a2 2 0 0 1 0 4h-1ZM16.8 17.5v-4h1.9M16.8 15.5h1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

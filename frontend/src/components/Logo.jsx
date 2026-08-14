export default function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-label="Guruji logo">
      <defs>
        <linearGradient id="guruji-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#0f2540" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#guruji-bg)" />
      {/* winding mountain road, evoking corridors like Monteagle/Jellico */}
      <path
        d="M13 46 C13 34, 26 38, 26 27 C26 18, 38 20, 38 14"
        stroke="#fff"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M13 46 C13 34, 26 38, 26 27" stroke="#f5b400" strokeWidth="1.5" strokeDasharray="3,3" fill="none" strokeLinecap="round" />
      {/* destination pin at the top of the road */}
      <circle cx="44" cy="16" r="7" fill="#22c55e" stroke="#fff" strokeWidth="2" />
      <circle cx="44" cy="16" r="2.4" fill="#fff" />
    </svg>
  );
}

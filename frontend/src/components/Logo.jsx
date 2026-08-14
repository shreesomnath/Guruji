export default function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-label="Guruji logo">
      <defs>
        <linearGradient id="guruji-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="road-gradient" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>
      <circle cx="32" cy="32" r="32" fill="url(#guruji-bg)" />
      
      {/* stylized road */}
      <path
        d="M 18 52 C 18 38, 32 40, 32 28 C 32 20, 42 22, 42 12"
        stroke="url(#road-gradient)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        filter="url(#shadow)"
      />
      {/* center dashed line */}
      <path 
        d="M 18 52 C 18 38, 32 40, 32 28 C 32 20, 42 22, 42 12" 
        stroke="#fbbf24" 
        strokeWidth="1.5" 
        strokeDasharray="4,4" 
        fill="none" 
        strokeLinecap="round" 
      />
      
      {/* sleek destination pin */}
      <path 
        d="M 42 6 C 38.686 6 36 8.686 36 12 C 36 16.5 42 22 42 22 C 42 22 48 16.5 48 12 C 48 8.686 45.314 6 42 6 Z" 
        fill="#10b981" 
        filter="url(#shadow)"
      />
      <circle cx="42" cy="12" r="2.5" fill="#ffffff" />
    </svg>
  );
}

import L from "leaflet";

export function badgeIcon(emoji, { color = "#333", size = 22, dashed = false } = {}) {
  const html = `<div class="badge-icon${dashed ? " dashed" : ""}" style="border-color:${color}; width:${size}px; height:${size}px; font-size:${Math.round(
    size * 0.55
  )}px;">${emoji}</div>`;
  return L.divIcon({
    html,
    className: "pin-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2) - 2],
  });
}

export function pinIcon(color) {
  const svg = `
    <svg width="36" height="50" viewBox="0 0 36 50" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow-pin" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M18 2C9.163 2 2 9.163 2 18c0 12 16 28 16 28s16-16 16-28c0-8.837-7.163-16-16-16z" fill="${color}" stroke="#ffffff" stroke-width="2.5" filter="url(#shadow-pin)" />
      <circle cx="18" cy="18" r="6" fill="#ffffff" filter="url(#shadow-pin)" />
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "pin-icon",
    iconSize: [36, 50],
    iconAnchor: [18, 48],
    popupAnchor: [0, -45],
  });
}

export function stopIcon(number) {
  const svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow-stop" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/>
        </filter>
      </defs>
      <circle cx="16" cy="16" r="13" fill="#f59e0b" stroke="#ffffff" stroke-width="2.5" filter="url(#shadow-stop)" />
      <text x="16" y="21" font-size="14" font-family="system-ui, sans-serif" font-weight="bold" text-anchor="middle" fill="#ffffff">${number}</text>
    </svg>`;
  return L.divIcon({ html: svg, className: "pin-icon", iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -16] });
}

export function truckIcon(color) {
  const svg = `
    <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow-truck" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#000" flood-opacity="0.4"/>
        </filter>
      </defs>
      <path d="M20,8h-3V6c0-1.1-0.9-2-2-2H3C1.9,4,1,4.9,1,6v11h2c0,1.66,1.34,3,3,3s3-1.34,3-3h6c0,1.66,1.34,3,3,3s3-1.34,3-3h2v-5 L20,8z M6,18c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S6.55,18,6,18z M18,18c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1 S18.55,18,18,18z M17,12V9.5h2.5l1.96,2.5H17z" fill="${color}" stroke="#ffffff" stroke-width="0.5" filter="url(#shadow-truck)" />
    </svg>`;
  return L.divIcon({ html: svg, className: "pin-icon", iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -20] });
}

export function foodIcon() {
  return badgeIcon("🍔", { color: "#f43f5e", size: 28 });
}

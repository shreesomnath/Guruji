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
    <svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 27 15 27s15-16.5 15-27C30 6.7 23.3 0 15 0z" fill="${color}" stroke="#111" stroke-width="1.5"/>
      <circle cx="15" cy="15" r="5.5" fill="#fff"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "pin-icon",
    iconSize: [30, 42],
    iconAnchor: [15, 40],
    popupAnchor: [0, -38],
  });
}

export function stopIcon(number) {
  const svg = `
    <svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
      <circle cx="13" cy="13" r="11" fill="#f59e0b" stroke="#111" stroke-width="1.5"/>
      <text x="13" y="18" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle" fill="#111">${number}</text>
    </svg>`;
  return L.divIcon({ html: svg, className: "pin-icon", iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -13] });
}

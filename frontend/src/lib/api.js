const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

async function getJson(url, options) {
  const res = await fetch(url, options);
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || "Request failed");
  return body;
}

export function fetchRoute({ fromLat, fromLng, toLat, toLng, mode, stops, truckHeight, truckWeight, hazmat }) {
  const params = new URLSearchParams({ fromLat, fromLng, toLat, toLng, mode });
  if (stops && stops.length > 0) {
    params.set("stops", stops.map((s) => `${s.lat},${s.lng}`).join("|"));
  }
  if (truckHeight) params.set("truckHeight", truckHeight);
  if (truckWeight) params.set("truckWeight", truckWeight);
  if (hazmat) params.set("hazmat", hazmat);
  return getJson(`${API_BASE}/api/route?${params}`);
}

export function fetchHotspots() {
  return getJson(`${API_BASE}/api/hotspots`);
}

export function fetchRestAreas() {
  return getJson(`${API_BASE}/api/rest-areas`);
}

export function fetchParking() {
  return getJson(`${API_BASE}/api/parking`);
}

export function fetchEconomics({ distanceMiles, durationMinutes, overrides }) {
  return getJson(`${API_BASE}/api/economics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ distanceMiles, durationMinutes, overrides }),
  });
}

export function fetchGeocode(query, near) {
  const params = new URLSearchParams({ q: query });
  if (near) params.set("near", `${near.lat},${near.lng}`);
  return getJson(`${API_BASE}/api/geocode?${params}`);
}

export function fetchGasStations() {
  return getJson(`${API_BASE}/api/gas-stations`);
}

export function fetchFood() {
  return getJson(`${API_BASE}/api/food`);
}

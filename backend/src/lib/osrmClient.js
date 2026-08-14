const OSRM_BASE_URL = process.env.OSRM_BASE_URL || "https://router.project-osrm.org";

/**
 * Fetches candidate driving routes between two points from the public OSRM
 * demo server, optionally threaded through intermediate waypoints (stops).
 * Phase 2 can swap OSRM_BASE_URL to a self-hosted instance with a Tennessee
 * OSM extract + truck profile without changing callers.
 *
 * OSRM only returns multiple alternatives for simple two-point trips, so
 * routes with stops fall back to a single computed route.
 */
export async function getCandidateRoutes({ fromLat, fromLng, toLat, toLng, waypoints = [] }) {
  const allPoints = [{ lat: fromLat, lng: fromLng }, ...waypoints, { lat: toLat, lng: toLng }];
  const coords = allPoints.map((p) => `${p.lng},${p.lat}`).join(";");
  const alternatives = waypoints.length === 0;
  const url = `${OSRM_BASE_URL}/route/v1/driving/${coords}?alternatives=${alternatives}&overview=full&geometries=geojson`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`OSRM request failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (data.code !== "Ok" || !data.routes?.length) {
    throw new Error(`OSRM returned no routes: ${data.code ?? "unknown error"}`);
  }

  return data.routes.map((route, index) => ({
    id: `route-${index}`,
    distanceMiles: route.distance / 1609.34,
    durationMinutes: route.duration / 60,
    geometry: route.geometry,
  }));
}

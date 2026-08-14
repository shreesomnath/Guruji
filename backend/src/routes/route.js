import { Router } from "express";
import { getCandidateRoutes } from "../lib/osrmClient.js";
import { scoreRouteAgainstHotspots, findNearestPoints } from "../lib/routeScoring.js";
import { computeEconomics } from "../lib/economics.js";
import { hotspots, parking, economicsConfig } from "../lib/dataStore.js";

const router = Router();

router.get("/", async (req, res) => {
  const { fromLat, fromLng, toLat, toLng, mode = "fastest", stops } = req.query;

  const coords = { fromLat, fromLng, toLat, toLng };
  for (const [key, value] of Object.entries(coords)) {
    if (value === undefined || Number.isNaN(Number(value))) {
      return res.status(400).json({ error: `${key} is required and must be a number` });
    }
  }
  if (!["fastest", "safest"].includes(mode)) {
    return res.status(400).json({ error: 'mode must be "fastest" or "safest"' });
  }

  const parsed = Object.fromEntries(Object.entries(coords).map(([k, v]) => [k, Number(v)]));

  let waypoints = [];
  if (stops) {
    try {
      waypoints = stops.split("|").map((pair) => {
        const [lat, lng] = pair.split(",").map(Number);
        if (Number.isNaN(lat) || Number.isNaN(lng)) throw new Error("bad pair");
        return { lat, lng };
      });
    } catch {
      return res.status(400).json({ error: 'stops must look like "lat,lng|lat,lng"' });
    }
  }

  try {
    const candidates = await getCandidateRoutes({ ...parsed, waypoints });

    const scored = candidates.map((candidate) => {
      const { hotspotScore, hotspotsOnRoute } = scoreRouteAgainstHotspots(candidate.geometry, hotspots);
      return { ...candidate, hotspotScore, hotspotsOnRoute };
    });

    const fastest = [...scored].sort((a, b) => a.durationMinutes - b.durationMinutes)[0];
    const safest = [...scored].sort(
      (a, b) => a.hotspotScore - b.hotspotScore || a.durationMinutes - b.durationMinutes
    )[0];

    const selected = mode === "safest" ? safest : fastest;

    const economicsFastest = computeEconomics({
      distanceMiles: fastest.distanceMiles,
      durationMinutes: fastest.durationMinutes,
      config: economicsConfig,
    });

    const economicsSafest = computeEconomics({
      distanceMiles: safest.distanceMiles,
      durationMinutes: safest.durationMinutes,
      config: economicsConfig,
    });

    const nearestParking = findNearestPoints([parsed.toLng, parsed.toLat], parking, 3);

    res.json({
      mode,
      selected: {
        distanceMiles: round1(selected.distanceMiles),
        durationMinutes: round1(selected.durationMinutes),
        geometry: selected.geometry,
        hotspotScore: selected.hotspotScore,
        hotspotsOnRoute: selected.hotspotsOnRoute,
      },
      fastest: {
        distanceMiles: round1(fastest.distanceMiles),
        durationMinutes: round1(fastest.durationMinutes),
        hotspotScore: fastest.hotspotScore,
        economics: economicsFastest
      },
      safest: {
        distanceMiles: round1(safest.distanceMiles),
        durationMinutes: round1(safest.durationMinutes),
        hotspotScore: safest.hotspotScore,
        economics: economicsSafest
      },
      alternatives: scored.map((s) => ({
        id: s.id,
        distanceMiles: round1(s.distanceMiles),
        durationMinutes: round1(s.durationMinutes),
        hotspotScore: s.hotspotScore,
        geometry: s.geometry,
      })),
      economics: mode === "safest" ? economicsSafest : economicsFastest,
      nearestParking,
    });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

function round1(n) {
  return Math.round(n * 10) / 10;
}

export default router;

import { Router } from "express";
import * as turf from "@turf/turf";

const router = Router();

// Fallback bias box (roughly Tennessee) used only when the caller doesn't
// supply a "near" reference point (e.g. GPS not yet available).
const TN_VIEWBOX = "-90.6,36.7,-81.6,34.9";
const VIEWBOX_DEGREES = 2.5; // ~170mi half-width around the reference point

router.get("/", async (req, res) => {
  const { q, near } = req.query;
  if (!q || typeof q !== "string" || q.trim().length < 3) {
    return res.status(400).json({ error: "q (search text, 3+ chars) is required" });
  }

  let nearPoint = null;
  if (near) {
    const [lat, lng] = near.split(",").map(Number);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) nearPoint = { lat, lng };
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "8");
  url.searchParams.set("countrycodes", "us");

  if (nearPoint) {
    const { lat, lng } = nearPoint;
    // "left,top,right,bottom" — a soft bias box centered on the caller's location.
    url.searchParams.set(
      "viewbox",
      `${lng - VIEWBOX_DEGREES},${lat + VIEWBOX_DEGREES},${lng + VIEWBOX_DEGREES},${lat - VIEWBOX_DEGREES}`
    );
  } else {
    url.searchParams.set("viewbox", TN_VIEWBOX);
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        // Nominatim's usage policy requires a real identifying User-Agent.
        "User-Agent": "OPTIMA-FLEET-prototype/0.1 (TSU freight routing student project)",
      },
    });
    if (!upstream.ok) {
      throw new Error(`Nominatim request failed: ${upstream.status}`);
    }
    const results = await upstream.json();

    let hits = results.map((r) => ({
      label: r.display_name,
      lat: Number(r.lat),
      lng: Number(r.lon),
    }));

    // Nominatim's viewbox is only a soft bias — a same-named place on the
    // far side of the country can still outrank a close one. Re-sort by
    // actual distance from the caller's location to fix that.
    if (nearPoint) {
      const origin = turf.point([nearPoint.lng, nearPoint.lat]);
      hits = hits
        .map((h) => ({ ...h, distanceMiles: turf.distance(origin, turf.point([h.lng, h.lat]), { units: "miles" }) }))
        .sort((a, b) => a.distanceMiles - b.distanceMiles);
    }

    res.json(hits.slice(0, 5));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

export default router;

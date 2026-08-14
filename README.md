# Guruji — OPTIMA-FLEET Freight Routing Prototype

**Developers:** Er. Somnath Luitel, Er. Arbin Amagain

A web app that helps Tennessee truck drivers find the safest/fastest route (with crash hotspots,
truck parking, rest areas, and gas stations) and gives freight companies a cost breakdown per
route. Built as the Task 12 software prototype for **OPTIMA-FLEET**, a TSU research project on
AI-driven freight logistics done in partnership with TDOT Freight Planning — see `PRODUCT.md` for
the full product context and `Expanded Tasks and delivarables-no names--Sample.pdf` for the
original 12-task research scope.

## Quick start

Requires [Node.js](https://nodejs.org) 18 or newer.

```
npm run install:all   # installs backend + frontend dependencies
npm run dev            # starts backend (port 4000) and frontend (port 5173) together
```

Then open **http://localhost:5173** in a browser. (`npm run dev:backend` / `npm run dev:frontend`
run either side alone if needed.)

No API keys are required — every external service used (OpenStreetMap/Nominatim, OSRM, Overpass,
Esri satellite tiles, OpenTopoMap, CartoDB) is free and publicly accessible.

## What's built so far

**Driver-facing routing**
- Search-first flow: type a place → get a "Directions" card → Origin/Destination form, mirroring
  how Google Maps' directions flow works
- Address & POI search (OpenStreetMap Nominatim) biased toward the user's actual GPS location, not
  a fixed region — e.g. searching "Bowling Green" near Nashville correctly surfaces Bowling Green,
  KY over farther-away same-named cities
- "Use my location" and full live-GPS **Start Trip** mode that automatically re-routes as the
  driver moves (distance + time throttled so it doesn't hammer the routing server)
- **Fastest vs. Safest** route toggle — Safest is computed by scoring OSRM's alternative routes
  against a crash-hotspot layer using turf.js, not just picking the shortest path
- Multi-stop routing — add a stop by searching an address or clicking "Add as stop" on any gas
  station / rest area / parking marker popup

**Map layers** (off by default, toggled via quick-filter chips next to the search box)
- ⚠️ Crash hotspots — mock data shaped like real TDOT TITAN crash records, including two
  real documented truck-crash corridors (Monteagle Mountain on I-24, Jellico Mountain on I-75)
- 🅿️ Truck parking — capacity + predicted availability, including flagged illegal
  ramp-parking pressure points (the real Hours-of-Service/parking problem TDOT is trying to solve)
- 🚻 Rest areas — TDOT-style facilities (restrooms/vending, no fuel — that's realistic, not a bug)
- ⛽ Gas stations — **live real data** pulled from OpenStreetMap via the Overpass API along TN's
  freight corridors, with a small hand-authored fallback set if Overpass is ever unreachable
- Four basemap styles: Map, Satellite (Esri World Imagery), Terrain (OpenTopoMap), Dark (CartoDB)

**Freight/Premium view**
- Cost breakdown per route: fuel cost, driver time cost, maintenance cost, cost-per-mile
- Assumptions (diesel price, truck MPG, driver hourly rate, maintenance $/mi) are editable and
  recompute live

**Branding**
- Renamed to **Guruji** ("guide/mentor" in Nepali) with a hand-drawn SVG logo (winding mountain
  road → destination pin) used as both the in-app logo and browser favicon

## Architecture

```
backend/   Node/Express API — routing (OSRM proxy + safest/fastest scoring), hotspots,
           rest areas, parking, gas stations (Overpass), geocoding (Nominatim), economics
frontend/  React + Vite + Leaflet — map UI, search, layers, trip summary, economics panel
```

All "real" data layers (routing, gas stations, geocoding) call free public services directly from
the backend — no database, no paid APIs, no ArcGIS license needed. The crash-hotspot, rest-area,
and parking layers are currently hand-authored mock data shaped to match real TDOT/TN511 data
formats, so swapping in the real feeds later is a data-layer change, not a rewrite.

## Next moves (not built yet)

Roughly in order of effort:

1. **Weigh-station bypass status** along the route (open/closed) — trucking-specific, nothing
   like it exists in consumer maps
2. **HOS-clock countdown** — let a driver enter hours remaining and have the app proactively warn
   "stop within 45 min" using the parking layer that already exists
3. **Route cost comparison** — show Fastest vs. Safest cost side-by-side in the Premium panel
   ("$40 more but 3 fewer hotspots") instead of only showing the selected route's numbers
4. **Corridor Travel-Time Reliability Index** — "usually 2.5 hrs, but can run to 4 hrs," not just
   a single ETA number
5. **Real data ingestion** — TDOT TITAN crash API, TN511 congestion feed, live diesel prices,
   replacing the mock hotspot/rest-area/parking datasets
6. **Self-hosted OSRM** with a Tennessee OSM extract + truck-specific routing profile
   (height/weight/hazmat restrictions, no public-server rate limits)
7. **Trained crash-prediction ML model** replacing the static mock hotspot scoring
8. **Real-time parking prediction** feed (the actual Task 10 deliverable)
9. **Emissions panel** (VOC/CO/NOx/SOx/CO2 per route) once VISSIM/MOVES outputs are available
10. **Truck platoon matching** — surface nearby trucks on the same corridor/time window
11. Accounts + subscription billing for the freight-company premium tier
12. Production deployment (containerized backend, hosted frontend)

See `PRODUCT.md` for the fuller product write-up and how each item maps back to OPTIMA-FLEET's
12-task research scope.

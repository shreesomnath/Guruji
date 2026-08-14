# Guruji — Product Draft
### (working name — "guide/mentor" in Nepali; OPTIMA-FLEET Freight Tool, Task 12 prototype)

## What this is
A web app that helps two audiences plan Tennessee freight trips:
- **Public / owner-operator truck drivers** — pick a route that balances travel time against crash risk, see congestion and crash hotspots, and find truck parking before Hours-of-Service (HOS) limits force a stop.
- **Freight companies** (Amazon/FedEx/USPS/UPS/J.B. Hunt-style fleets) — everything drivers get, plus a cost/economics breakdown per route (fuel, driver time, maintenance) to support dispatch and planning decisions. Gated behind a "premium" view for now (no real billing yet — see Roadmap).

This is the prototype tool for **Task 12** ("Develop Optimization and Analysis TOOLS for Freight Logistics Efficiency in Tennessee") of **OPTIMA-FLEET**, a TSU research project on AI-driven freight logistics done in partnership with the TDOT Freight Planning Division (see `Expanded Tasks and delivarables-no names--Sample.pdf` for the full 12-task research scope). It's meant to demonstrate, end-to-end, what the other 11 research tasks eventually feed: corridor data (Task 2), crash/deficiency analysis (Tasks 3, 7), traffic operations data (Task 6), economic impact analysis (Task 9), and truck parking optimization (Task 10).

## Problem it addresses
Tennessee's I-40/I-24/I-75/I-65/I-55/I-240 corridors carry heavy freight traffic for FedEx, UPS, J.B. Hunt, Old Dominion and others. Drivers face:
- Congestion and inefficient routing with no real-time visibility into crash-prone segments
- No integrated way to weigh "fastest" against "safest" when choosing a route
- A truck parking shortage that pushes drivers into illegal ramp/shoulder parking near HOS limits — a real safety and compliance problem TDOT is actively trying to solve
- Freight companies lacking a simple way to see the cost impact (fuel, time, maintenance) of one route choice vs. another

## Phase 1 scope (current build)
- Route search three ways: type an address (autocomplete via OpenStreetMap Nominatim), click "Use my location" (browser geolocation), or click the map to drop a pin
- "Fastest" vs "Safest" route toggle — safest is chosen by scoring OSRM's alternative routes against mock crash-hotspot density along each path
- **Live trip tracking**: "Start Trip" watches the browser's GPS position and automatically re-fetches the route (recentering the map) once the driver has moved far enough from the last calculated route — a working version of dynamic rerouting, not just a mock
- Crash hotspot layer (mock data shaped like TDOT TITAN crash records: location, severity, road)
- Truck parking layer (mock data: capacity + predicted availability per site) — addresses the Task 10 HOS/parking problem directly
- Rest area layer (fuel/food amenities, separate from parking-capacity data)
- Trip summary: distance, duration, hotspot count on the chosen route, nearest parking option
- Freight/"premium" toggle revealing a cost breakdown: fuel cost, driver time cost, maintenance cost, cost-per-mile — using an editable config of assumptions (diesel price, truck MPG, driver hourly rate)

## Explicitly out of scope for Phase 1 (see Roadmap)
Real-time crash/congestion data feeds, a trained crash-prediction ML model, accounts/subscriptions/payments, a self-hosted routing engine, and emissions modeling (VISSIM/MOVES) are all real parts of OPTIMA-FLEET's broader scope but require infrastructure, licensed data access, or research work (surveys, model training) beyond a first prototype. (Live GPS tracking and dynamic rerouting, originally planned as Phase 2, shipped in Phase 1 — see above.)

## Data sources
| Layer | Phase 1 (now) | Phase 2+ (real) |
|---|---|---|
| Routing | Public OSRM demo server (OpenStreetMap roads) | Self-hosted OSRM/Valhalla with TN OSM extract + truck profile |
| Crash hotspots | Hand-authored mock GeoJSON, TDOT TITAN-shaped fields | TDOT TITAN crash database |
| Congestion | Not yet implemented | TN511 real-time feed |
| Truck parking | Hand-authored mock GeoJSON with predicted availability | Real-time parking sensor/ML prediction feed (Task 10 output) |
| Rest areas / fuel | Hand-authored mock GeoJSON | TDOT rest area list / crowdsourced or commercial POI data |
| Economics assumptions | Editable config constants (diesel price, MPG, driver rate) | Live fuel price API, company-specific fleet data |
| Address search | OpenStreetMap Nominatim (free, public) | Same, or a commercial geocoder if volume/rate limits become an issue |
| Live position | Browser Geolocation API (`watchPosition`) | Same — already real, not mock |

## Roadmap (post-Phase-1)
1. Real data ingestion — TDOT TITAN crash API, TN511 congestion feed, live diesel prices (supports Tasks 4/6)
2. Self-hosted OSRM with a Tennessee OSM extract + truck-specific routing profile (height/weight/hazmat restrictions, no public-server rate limits)
3. Trained crash-prediction ML model replacing the static mock hotspot scoring (Task 7)
4. Real-time parking prediction + live availability feed (Task 10)
5. Emissions panel (VOC/CO/NOx/SOx/CO2 per route) once VISSIM/MOVES outputs are available (Task 11)
6. Accounts + subscription billing for the freight-company premium tier
7. Production deployment (containerized backend, hosted frontend)
8. Differentiators beyond standard consumer maps (brainstormed, not yet built): HOS-clock-aware parking alerts, a corridor Travel-Time Reliability Index, truck platoon matching, a "what-if" corridor closure simulator, weigh-station bypass status, and live idling-cost-in-dollars display

## Tech stack (Phase 1)
- Frontend: React + Vite + Leaflet
- Backend: Node/Express
- Routing: public OSRM demo server
- Geospatial scoring: turf.js
- Data: static GeoJSON/JSON files (no database yet)

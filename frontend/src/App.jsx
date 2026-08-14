import { useCallback, useEffect, useRef, useState } from "react";
import MapView from "./components/MapView.jsx";
import RouteForm from "./components/RouteForm.jsx";
import PlaceSearchCard from "./components/PlaceSearchCard.jsx";
import TripSummary from "./components/TripSummary.jsx";
import EconomicsPanel from "./components/EconomicsPanel.jsx";
import AccountModal from "./components/AccountModal.jsx";
import { fetchRoute, fetchHotspots, fetchRestAreas, fetchParking, fetchGasStations } from "./lib/api.js";
import { haversineMiles } from "./lib/geo.js";

const REROUTE_MIN_MOVE_MILES = 0.15;
const REROUTE_MIN_INTERVAL_MS = 8000;

export default function App() {
  const [viewMode, setViewMode] = useState("search"); // "search" | "directions"
  const [searchedPlace, setSearchedPlace] = useState(null); // { lat, lng, label }

  const [origin, setOrigin] = useState(null); // { lat, lng, label }
  const [destination, setDestination] = useState(null); // { lat, lng, label }
  const [stops, setStops] = useState([]);
  const [mode, setMode] = useState("fastest");
  const [routeResult, setRouteResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [geoError, setGeoError] = useState(null);

  const [hotspots, setHotspots] = useState(null);
  const [restAreas, setRestAreas] = useState(null);
  const [parking, setParking] = useState(null);
  const [gasStations, setGasStations] = useState(null);
  const [layers, setLayers] = useState({ hotspots: false, restAreas: false, parking: false, gasStations: false });

  const [isPremiumView, setIsPremiumView] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const [tracking, setTracking] = useState(false);
  const watchIdRef = useRef(null);
  const lastRerouteRef = useRef({ position: null, time: 0 });

  useEffect(() => {
    fetchHotspots().then(setHotspots).catch((e) => setError(e.message));
    fetchRestAreas().then(setRestAreas).catch((e) => setError(e.message));
    fetchParking().then(setParking).catch((e) => setError(e.message));
    fetchGasStations().then(setGasStations).catch((e) => setError(e.message));

    // Silently try to bias address search toward wherever the user actually
    // is. Failure here is fine — search just falls back to a TN-wide bias.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 8000, maximumAge: 300000 }
      );
    }
  }, []);

  const handleMapClick = (latlng) => {
    if (viewMode === "search") {
      setSearchedPlace({ ...latlng, label: "Dropped pin" });
      return;
    }
    if (tracking) return;
    if (!origin) {
      setOrigin({ ...latlng, label: "Dropped pin" });
    } else if (!destination) {
      setDestination({ ...latlng, label: "Dropped pin" });
    } else {
      setOrigin({ ...latlng, label: "Dropped pin" });
      setDestination(null);
      setRouteResult(null);
    }
  };

  const runRoute = useCallback(async (fromLatLng, toLatLng, routeMode, stopsList = []) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRoute({
        fromLat: fromLatLng.lat,
        fromLng: fromLatLng.lng,
        toLat: toLatLng.lat,
        toLng: toLatLng.lng,
        mode: routeMode,
        stops: stopsList,
      });
      setRouteResult(result);
      return result;
    } catch (e) {
      setError(e.message);
      setRouteResult(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFindRoute = () => {
    if (origin && destination) runRoute(origin, destination, mode, stops);
  };

  const handleClear = () => {
    if (tracking) stopTrip();
    setOrigin(null);
    setDestination(null);
    setStops([]);
    setRouteResult(null);
    setError(null);
  };

  const handleAddStop = (latlng, label) => {
    setStops((prev) => [...prev, { ...latlng, label }]);
  };

  const handleRemoveStop = (index) => {
    setStops((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectOrigin = (latlng, label) => {
    setOrigin({ ...latlng, label });
  };

  const handleSelectDestination = (latlng, label) => {
    setDestination({ ...latlng, label });
  };

  const handleUseMyLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setOrigin({ ...here, label: "Your location" });
        setUserLocation(here);
      },
      (err) => setGeoError(`Could not get your location: ${err.message}`),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // --- Search-first flow -------------------------------------------------

  const handleSelectPlace = (latlng, label) => {
    setSearchedPlace({ ...latlng, label });
  };

  const handleGetDirections = () => {
    if (!searchedPlace) return;
    setDestination(searchedPlace);
    setOrigin(userLocation ? { ...userLocation, label: "Your location" } : null);
    setStops([]);
    setRouteResult(null);
    setError(null);
    setViewMode("directions");
  };

  const handleDirectionsFromMyLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(here);
        setOrigin({ ...here, label: "Your location" });
        setDestination(searchedPlace);
        setStops([]);
        setRouteResult(null);
        setError(null);
        setViewMode("directions");
      },
      (err) => setGeoError(`Could not get your location: ${err.message}`),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleBackToSearch = () => {
    if (tracking) stopTrip();
    setViewMode("search");
    setOrigin(null);
    setDestination(null);
    setStops([]);
    setRouteResult(null);
    setError(null);
  };

  // -------------------------------------------------------------------

  const startTrip = () => {
    if (!origin || !destination) return;
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by this browser.");
      return;
    }

    lastRerouteRef.current = { position: origin, time: Date.now() };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setOrigin({ ...here, label: "Your location (live)" });

        const { position: lastPos, time: lastTime } = lastRerouteRef.current;
        const movedEnough = !lastPos || haversineMiles(lastPos, here) >= REROUTE_MIN_MOVE_MILES;
        const enoughTimePassed = Date.now() - lastTime >= REROUTE_MIN_INTERVAL_MS;

        if (movedEnough && enoughTimePassed) {
          lastRerouteRef.current = { position: here, time: Date.now() };
          runRoute(here, destination, mode, stops);
        }
      },
      (err) => setGeoError(`Live tracking error: ${err.message}`),
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    setTracking(true);
  };

  const stopTrip = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setTracking(false);
  };

  const handleSelectAlternative = (alt) => {
    setRouteResult((prev) => ({
      ...prev,
      mode: "custom",
      selected: {
        distanceMiles: alt.distanceMiles,
        durationMinutes: alt.durationMinutes,
        geometry: alt.geometry,
        hotspotScore: alt.hotspotScore,
        hotspotsOnRoute: alt.hotspotsOnRoute || [],
      },
    }));
  };

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem("guruji_profile");
    if (saved) return JSON.parse(saved);
    return { name: "", savedLocations: [] };
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  const saveProfile = (newProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem("guruji_profile", JSON.stringify(newProfile));
    setShowAuthModal(false);
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("guruji_theme") === "dark";
  });

  const [hosHours, setHosHours] = useState("");

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem("guruji_theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <div className={`app ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="app-body">
        <main className="map-wrap">
          <MapView
            origin={origin}
            destination={destination}
            searchedPlace={viewMode === "search" ? searchedPlace : null}
            stops={stops}
            onMapClick={handleMapClick}
            onAddStop={handleAddStop}
            routeGeometry={routeResult?.selected.geometry}
            alternatives={routeResult?.alternatives}
            onSelectAlternative={handleSelectAlternative}
            hotspots={hotspots}
            restAreas={restAreas}
            parking={parking}
            gasStations={gasStations}
            layers={layers}
            tracking={tracking}
            isDarkMode={isDarkMode}
            hosHours={hosHours}
            tripDurationMinutes={routeResult?.selected.durationMinutes}
          />
        </main>

        <div className="floating-panel">
          {viewMode === "search" ? (
            <PlaceSearchCard
              isPremiumView={isPremiumView}
              onTogglePremium={() => setIsPremiumView((v) => !v)}
              place={searchedPlace}
              onSelectPlace={handleSelectPlace}
              onGetDirections={handleGetDirections}
              onUseMyLocationDirections={handleDirectionsFromMyLocation}
              searchNear={userLocation}
              layers={layers}
              setLayers={setLayers}
              error={geoError || error}
              savedLocations={userProfile.savedLocations}
            />
          ) : (
            <RouteForm
              isPremiumView={isPremiumView}
              onTogglePremium={() => setIsPremiumView((v) => !v)}
              onBack={handleBackToSearch}
              origin={origin}
              destination={destination}
              searchNear={userLocation || origin}
              onSelectOrigin={handleSelectOrigin}
              onSelectDestination={handleSelectDestination}
              onUseMyLocation={handleUseMyLocation}
              geoError={geoError}
              stops={stops}
              onAddStop={handleAddStop}
              onRemoveStop={handleRemoveStop}
              mode={mode}
              setMode={setMode}
              onFindRoute={handleFindRoute}
              onClear={handleClear}
              layers={layers}
              setLayers={setLayers}
              loading={loading}
              error={error}
              tracking={tracking}
              onStartTrip={startTrip}
              onStopTrip={stopTrip}
              savedLocations={userProfile.savedLocations}
            />
          )}
          {viewMode === "directions" && <TripSummary result={routeResult} hosHours={hosHours} setHosHours={setHosHours} />}
          {viewMode === "directions" && isPremiumView && routeResult && <EconomicsPanel result={routeResult} />}
          {viewMode === "directions" && isPremiumView && !routeResult && (
            <div className="panel premium">
              <h2>Freight economics (premium)</h2>
              <p className="hint">
                Hit "Find Route" — this panel will show a fuel / driver-time / maintenance cost breakdown for that
                trip, with editable assumptions for your fleet.
              </p>
            </div>
          )}
        </div>

        {/* Profile / Sign In / Dark Mode at Top Right Corner */}
        <div className="top-right-controls" style={{ 
          position: "absolute", top: "16px", right: "16px", zIndex: 1000, 
          background: "white", padding: "6px 8px 6px 6px", borderRadius: "24px", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: "10px",
          transition: "background 0.3s"
        }}>
          <button 
            onClick={toggleDarkMode}
            style={{ 
              background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", 
              padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" 
            }}
            title="Toggle Dark Mode"
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>
          
          <div style={{ width: "1px", height: "24px", background: "#e2e8f0" }}></div>

          {/* Profile Avatar Placeholder */}
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%", background: "#e2e8f0", 
            display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#94a3b8" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
            </svg>
          </div>
          
          <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: "#334155", paddingLeft: "2px" }}>
            {userProfile.name ? `Hello, ${userProfile.name}` : "Guest"}
          </span>
          <button 
            className="primary" 
            onClick={() => setShowAuthModal(true)} 
            style={{ margin: 0, padding: "6px 16px", borderRadius: "20px", fontSize: "0.85rem" }}
          >
            {userProfile.name ? "Profile" : "Sign In"}
          </button>
        </div>

        {/* Developer Credits at Bottom Right Corner */}
        <div style={{ 
          position: "absolute", bottom: "24px", right: "80px", zIndex: 1000, 
          background: "rgba(255,255,255,0.95)", padding: "10px 16px", borderRadius: "8px", 
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: "0.85rem", color: "#334155",
          backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.5)"
        }}>
          Developed by 
          <b style={{ color: "#1a73e8", fontFamily: "'Poppins', sans-serif", marginLeft: "6px" }}>Er. Somnath Luitel</b> 
          <span style={{ margin: "0 6px", color: "#94a3b8" }}>&</span> 
          <b style={{ color: "#1a73e8", fontFamily: "'Poppins', sans-serif" }}>Er. Arbin Amagain</b>
        </div>
      </div>
      
      {showAuthModal && (
        <AccountModal 
          userProfile={userProfile} 
          onSave={saveProfile} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
    </div>
  );
}

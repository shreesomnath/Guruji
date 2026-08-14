import {
  MapContainer,
  TileLayer,
  LayersControl,
  ZoomControl,
  Polyline,
  Marker,
  CircleMarker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import { pinIcon, stopIcon } from "../lib/mapIcons.js";
import HotspotLayer from "./HotspotLayer.jsx";
import RestAreaLayer from "./RestAreaLayer.jsx";
import ParkingLayer from "./ParkingLayer.jsx";
import GasStationLayer from "./GasStationLayer.jsx";
import TrafficLayer from "./TrafficLayer.jsx";

const TENNESSEE_CENTER = [35.86, -86.4];
const ORIGIN_ICON = pinIcon("#22c55e");
const DESTINATION_ICON = pinIcon("#ef4444");
const SEARCH_ICON = pinIcon("#2563eb");

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function RecenterOnTracking({ position, tracking }) {
  const map = useMap();
  useEffect(() => {
    if (tracking && position) {
      map.panTo([position.lat, position.lng], { animate: true });
    }
  }, [position, tracking, map]);
  return null;
}

function FlyToPlace({ place }) {
  const map = useMap();
  useEffect(() => {
    if (place) {
      map.flyTo([place.lat, place.lng], Math.max(map.getZoom(), 11), { duration: 0.8 });
    }
  }, [place, map]);
  return null;
}

function FitRouteBounds({ routePositions, tracking }) {
  const map = useMap();
  useEffect(() => {
    if (!tracking && routePositions && routePositions.length > 1) {
      map.fitBounds(L.latLngBounds(routePositions), { padding: [48, 48] });
    }
  }, [routePositions, tracking, map]);
  return null;
}

function MapEffect({ origin, destination, routePositions, tracking, searchedPlace, appMode, fleetTrucks }) {
  const map = useMap();

  useEffect(() => {
    if (appMode === "dispatcher" && fleetTrucks && fleetTrucks.length > 0) {
      // Zoom out to see all fleet trucks
      const bounds = L.latLngBounds(fleetTrucks.map(t => [t.lat, t.lng]));
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
      return;
    }

    if (routePositions && routePositions.length > 0) {
      map.fitBounds(L.latLngBounds(routePositions), { padding: [48, 48] });
    }
  }, [routePositions, tracking, map]);
  return null;
}

export default function MapView({
  origin,
  destination,
  searchedPlace,
  stops,
  onMapClick,
  onAddStop,
  routeGeometry,
  alternatives,
  onSelectAlternative,
  hotspots,
  restAreas,
  parking,
  gasStations,
  layers,
  tracking,
  isDarkMode,
  hosHours,
  tripDurationMinutes,
  appMode,
  fleetTrucks
}) {
  const routePositions = routeGeometry
    ? routeGeometry.coordinates.map(([lng, lat]) => [lat, lng])
    : null;

  return (
    <MapContainer center={TENNESSEE_CENTER} zoom={7} zoomControl={false} style={{ height: "100%", width: "100%" }}>
      <ZoomControl position="bottomright" />
      <LayersControl position="bottomright">
        <LayersControl.BaseLayer checked name="Map">
          <TileLayer
            key={isDarkMode ? "dark" : "light"}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={isDarkMode 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            }
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            attribution="Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Terrain">
          <TileLayer
            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Dark">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      <ClickHandler onMapClick={onMapClick} />
      <RecenterOnTracking position={origin} tracking={tracking} />
      {/* Render fleet markers in dispatcher mode */}
      {appMode === "dispatcher" && fleetTrucks?.map(truck => (
        <Marker 
          key={truck.id} 
          position={[truck.lat, truck.lng]} 
          icon={pinIcon(truck.status === "en-route" ? "#10b981" : truck.status === "delayed" ? "#ef4444" : "#94a3b8")}
        >
          <Popup>
            <div style={{ textAlign: "center" }}>
              <b>{truck.driver} (Truck #{truck.id})</b>
              <br/>
              Status: {truck.status.toUpperCase()}
              <br/>
              Speed: {Math.round(truck.speed)} mph
            </div>
          </Popup>
        </Marker>
      ))}

      <MapEffect 
        origin={origin} 
        destination={destination} 
        routePositions={routePositions} 
        tracking={tracking}
        searchedPlace={searchedPlace} 
        appMode={appMode}
        fleetTrucks={fleetTrucks}
      />

      {layers.hotspots && <HotspotLayer data={hotspots} />}
      {layers.restAreas && <RestAreaLayer data={restAreas} onAddStop={onAddStop} />}
      {layers.parking && <ParkingLayer data={parking} onAddStop={onAddStop} />}
      {layers.gasStations && <GasStationLayer data={gasStations} onAddStop={onAddStop} />}

      {/* Render unselected alternatives first so they are underneath the selected route */}
      {alternatives && alternatives.map((alt) => {
        // Skip rendering the alternative if it exactly matches the main route
        if (routeGeometry && routeGeometry.coordinates.length === alt.geometry.coordinates.length) {
          const isSame = routeGeometry.coordinates.every((coord, i) => 
            coord[0] === alt.geometry.coordinates[i][0] && coord[1] === alt.geometry.coordinates[i][1]
          );
          if (isSame) return null;
        }
        
        const altPositions = alt.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        return (
          <Polyline 
            key={alt.id} 
            positions={altPositions} 
            pathOptions={{ color: "#8a94a6", weight: 7, opacity: 0.6 }}
            eventHandlers={{ 
              click: () => onSelectAlternative && onSelectAlternative(alt),
              mouseover: (e) => e.target.setStyle({ color: "#60a5fa", opacity: 0.8 }),
              mouseout: (e) => e.target.setStyle({ color: "#8a94a6", opacity: 0.6 })
            }}
          >
            <Popup>
              <b>Alternative Route</b><br/>
              Time: {alt.durationMinutes} min<br/>
              Distance: {alt.distanceMiles} mi<br/>
              Hotspots: {alt.hotspotScore}<br/><br/>
              <button onClick={() => onSelectAlternative && onSelectAlternative(alt)}>Select this route</button>
            </Popup>
          </Polyline>
        );
      })}

      {routePositions && layers.traffic && (
        <TrafficLayer routePositions={routePositions} />
      )}
      {routePositions && !layers.traffic && (
        <Polyline positions={routePositions} pathOptions={{ color: "#1d4ed8", weight: 6, opacity: 0.9 }}>
          <Popup>
            <b>Selected Route</b>
          </Popup>
        </Polyline>
      )}

      {origin && tracking && (
        <CircleMarker
          center={[origin.lat, origin.lng]}
          radius={9}
          pathOptions={{ color: "#111", fillColor: "#2563eb", fillOpacity: 1, weight: 2 }}
        >
          <Popup>You are here (live)</Popup>
        </CircleMarker>
      )}
      {origin && !tracking && (
        <Marker position={[origin.lat, origin.lng]} icon={ORIGIN_ICON}>
          <Popup>Origin</Popup>
        </Marker>
      )}
      {destination && (
        <Marker position={[destination.lat, destination.lng]} icon={DESTINATION_ICON}>
          <Popup>Destination</Popup>
        </Marker>
      )}
      {searchedPlace && (
        <Marker position={[searchedPlace.lat, searchedPlace.lng]} icon={SEARCH_ICON}>
          <Popup>{searchedPlace.label}</Popup>
        </Marker>
      )}
      {stops?.map((stop, i) => (
        <Marker key={i} position={[stop.lat, stop.lng]} icon={stopIcon(i + 1)}>
          <Popup>
            Stop {i + 1}: {stop.label}
          </Popup>
        </Marker>
      ))}

      {hosHours && routePositions && tripDurationMinutes && (() => {
        const totalDurationHours = tripDurationMinutes / 60;
        if (Number(hosHours) >= totalDurationHours || Number(hosHours) <= 0) return null;
        
        const hosFraction = Number(hosHours) / totalDurationHours;
        const hosIndex = Math.floor(hosFraction * routePositions.length);
        if (hosIndex >= routePositions.length) return null;
        
        const hosCoord = routePositions[hosIndex];
        return (
          <CircleMarker
            center={hosCoord}
            radius={12}
            pathOptions={{ color: "#fff", fillColor: "#ef4444", fillOpacity: 1, weight: 3 }}
          >
            <Popup>
              <b>🛑 HOS Limit Reached</b><br/>
              You will run out of hours here.<br/>
              Plan your rest stop nearby!
            </Popup>
          </CircleMarker>
        );
      })()}
    </MapContainer>
  );
}

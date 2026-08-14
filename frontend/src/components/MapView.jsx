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

export default function MapView({
  origin,
  destination,
  searchedPlace,
  stops,
  onMapClick,
  onAddStop,
  routeGeometry,
  hotspots,
  restAreas,
  parking,
  gasStations,
  layers,
  tracking,
}) {
  const routePositions = routeGeometry
    ? routeGeometry.coordinates.map(([lng, lat]) => [lat, lng])
    : null;

  return (
    <MapContainer center={TENNESSEE_CENTER} zoom={7} zoomControl={false} style={{ height: "100%", width: "100%" }}>
      <ZoomControl position="bottomright" />
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
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
      <FitRouteBounds routePositions={routePositions} tracking={tracking} />
      <FlyToPlace place={searchedPlace} />

      {layers.hotspots && <HotspotLayer data={hotspots} />}
      {layers.restAreas && <RestAreaLayer data={restAreas} onAddStop={onAddStop} />}
      {layers.parking && <ParkingLayer data={parking} onAddStop={onAddStop} />}
      {layers.gasStations && <GasStationLayer data={gasStations} onAddStop={onAddStop} />}

      {routePositions && (
        <Polyline positions={routePositions} pathOptions={{ color: "#1d4ed8", weight: 5, opacity: 0.8 }} />
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
    </MapContainer>
  );
}

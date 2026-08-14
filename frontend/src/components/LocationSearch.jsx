import { useEffect, useRef, useState } from "react";
import { fetchGeocode } from "../lib/api.js";

export default function LocationSearch({ label, placeholder, onSelect, near, initialValue, onUseMyLocation }) {
  const [query, setQuery] = useState(initialValue || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    setQuery(initialValue || "");
  }, [initialValue]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 3 || query === initialValue) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const hits = await fetchGeocode(query, near);
        setResults(hits);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelect = (hit) => {
    onSelect({ lat: hit.lat, lng: hit.lng }, hit.label);
    setQuery(hit.label);
    setOpen(false);
  };

  const handleUseLocation = () => {
    setOpen(false);
    if (onUseMyLocation) onUseMyLocation();
  };

  return (
    <div className="location-search">
      <label className="field-label">{label}</label>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && (
        <ul className="search-results">
          {query.trim().length === 0 ? (
            <>
              {onUseMyLocation && (
                <li onMouseDown={handleUseLocation} style={{ fontWeight: "bold", color: "#2563eb" }}>
                  📍 Current Location
                </li>
              )}
              <li onMouseDown={() => handleSelect({ lat: 36.1627, lng: -86.7816, label: "Home (Nashville, TN)" })}>
                🏠 Home (Nashville, TN)
              </li>
              <li onMouseDown={() => handleSelect({ lat: 35.1495, lng: -90.0490, label: "Warehouse (Memphis, TN)" })}>
                📦 Warehouse (Memphis, TN)
              </li>
            </>
          ) : results.length > 0 ? (
            results.map((r, i) => (
              <li key={i} onMouseDown={() => handleSelect(r)}>
                {r.label}
                {typeof r.distanceMiles === "number" && (
                  <span className="result-distance"> — {Math.round(r.distanceMiles)} mi away</span>
                )}
              </li>
            ))
          ) : loading ? (
            <li className="search-hint">Searching…</li>
          ) : query.trim().length >= 3 ? (
            <li className="search-hint">No results found</li>
          ) : null}
        </ul>
      )}
    </div>
  );
}

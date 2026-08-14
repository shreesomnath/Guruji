import { useEffect, useRef, useState } from "react";
import { fetchGeocode } from "../lib/api.js";

export default function LocationSearch({ label, placeholder, onSelect, near, initialValue }) {
  const [query, setQuery] = useState(initialValue || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  // Reflect programmatic changes (e.g. "Use my location", the Directions
  // hand-off pre-filling the destination) without fighting the user's typing.
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

  return (
    <div className="location-search">
      <label className="field-label">{label}</label>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {loading && <span className="search-hint">Searching…</span>}
      {open && results.length > 0 && (
        <ul className="search-results">
          {results.map((r, i) => (
            <li key={i} onMouseDown={() => handleSelect(r)}>
              {r.label}
              {typeof r.distanceMiles === "number" && (
                <span className="result-distance"> — {Math.round(r.distanceMiles)} mi away</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { searchCities, getCitiesByState, City } from "@/data/cities";
import { useCity } from "@/context/CityContext";

export default function CitySearch() {
  const { selectedCity, setSelectedCity } = useCity();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCities = query ? searchCities(query) : [];
  const groupedCities = query ? null : getCitiesByState();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(city: City) {
    setSelectedCity(city);
    setQuery("");
    setIsOpen(false);
  }

  function handleClear() {
    setSelectedCity(null);
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <span className="pl-3 text-gray-400 text-sm">📍</span>
        {selectedCity ? (
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="text-sm font-medium text-slate-800">
              {selectedCity.name}, {selectedCity.state}
            </span>
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-red-500 transition-colors text-xs"
              aria-label="Clear city selection"
            >
              ✕
            </button>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="w-full px-3 py-2 text-sm text-slate-800 placeholder-gray-400 focus:outline-none bg-transparent"
            aria-label="Search for a city"
            aria-expanded={isOpen}
            role="combobox"
          />
        )}
      </div>

      {isOpen && !selectedCity && (
        <div className="absolute top-full left-0 mt-1 w-72 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          {query && filteredCities.length === 0 && (
            <p className="px-4 py-3 text-sm text-gray-500">No cities found for &quot;{query}&quot;</p>
          )}

          {query && filteredCities.length > 0 && (
            <ul role="listbox">
              {filteredCities.slice(0, 50).map((city) => (
                <li key={`${city.name}-${city.state}`}>
                  <button
                    onClick={() => handleSelect(city)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-rose-50 transition-colors flex justify-between items-center"
                  >
                    <span className="font-medium text-slate-800">{city.name}</span>
                    <span className="text-xs text-gray-400">{city.state}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!query && groupedCities && (
            <ul role="listbox">
              {Object.entries(groupedCities).map(([state, stateCities]) => (
                <li key={state}>
                  <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                    {state}
                  </p>
                  <ul>
                    {stateCities.map((city) => (
                      <li key={`${city.name}-${city.state}`}>
                        <button
                          onClick={() => handleSelect(city)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-rose-50 transition-colors"
                        >
                          <span className="text-slate-800">{city.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

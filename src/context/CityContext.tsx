"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { City } from "@/data/cities";

interface CityContextType {
  selectedCity: City | null;
  setSelectedCity: (city: City | null) => void;
}

const CityContext = createContext<CityContextType>({
  selectedCity: null,
  setSelectedCity: () => {},
});

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}

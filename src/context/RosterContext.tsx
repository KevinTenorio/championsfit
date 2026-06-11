"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getRoster, saveRoster, togglePokemon, canonicalName } from "@/lib/roster";

interface RosterContextValue {
  roster: Set<string>;
  toggle: (name: string) => void;
  has: (name: string) => boolean;
}

const RosterContext = createContext<RosterContextValue | null>(null);

export function RosterProvider({ children }: { children: React.ReactNode }) {
  const [roster, setRoster] = useState<Set<string>>(new Set());

  useEffect(() => {
    setRoster(getRoster());
  }, []);

  function toggle(name: string) {
    setRoster((prev) => {
      const next = togglePokemon(prev, name);
      saveRoster(next);
      return next;
    });
  }

  return (
    <RosterContext.Provider value={{ roster, toggle, has: (n) => roster.has(canonicalName(n)) }}>
      {children}
    </RosterContext.Provider>
  );
}

export function useRoster() {
  const ctx = useContext(RosterContext);
  if (!ctx) throw new Error("useRoster must be used within RosterProvider");
  return ctx;
}

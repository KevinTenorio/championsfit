"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getRoster,
  saveRoster,
  togglePokemon,
  getShiny,
  saveShiny,
  canonicalName,
} from "@/lib/roster";

interface RosterContextValue {
  roster: Set<string>;
  shiny: Set<string>;
  toggle: (name: string) => void;
  toggleShiny: (name: string) => void;
  has: (name: string) => boolean;
  isShiny: (name: string) => boolean;
}

const RosterContext = createContext<RosterContextValue | null>(null);

export function RosterProvider({ children }: { children: React.ReactNode }) {
  const [roster, setRoster] = useState<Set<string>>(new Set());
  const [shiny, setShiny] = useState<Set<string>>(new Set());

  useEffect(() => {
    setRoster(getRoster());
    setShiny(getShiny());
  }, []);

  function toggle(name: string) {
    // If the Pokémon is currently owned, this click un-owns it — drop its shiny
    // mark too, keeping the shiny ⊆ roster invariant.
    const willUnown = roster.has(name);
    setRoster((prev) => {
      const next = togglePokemon(prev, name);
      saveRoster(next);
      return next;
    });
    if (willUnown) {
      const key = canonicalName(name);
      setShiny((prev) => {
        if (!prev.has(key)) return prev;
        const next = new Set(prev);
        next.delete(key);
        saveShiny(next);
        return next;
      });
    }
  }

  function has(name: string) {
    return roster.has(canonicalName(name));
  }

  function toggleShiny(name: string) {
    // Shiny can only be marked on an owned Pokémon.
    if (!has(name)) return;
    const key = canonicalName(name);
    setShiny((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      saveShiny(next);
      return next;
    });
  }

  return (
    <RosterContext.Provider
      value={{
        roster,
        shiny,
        toggle,
        toggleShiny,
        has,
        isShiny: (n) => shiny.has(canonicalName(n)),
      }}
    >
      {children}
    </RosterContext.Provider>
  );
}

export function useRoster() {
  const ctx = useContext(RosterContext);
  if (!ctx) throw new Error("useRoster must be used within RosterProvider");
  return ctx;
}

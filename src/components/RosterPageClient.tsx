"use client";

import { useMemo, useState } from "react";
import { CHAMPIONS_MB } from "@/data/champions-mb";
import { useRoster } from "@/context/RosterContext";
import { PokemonSprite } from "./PokemonSprite";
import { ShinyIcon } from "./ShinyIcon";

export function RosterPageClient() {
  const { roster, toggle, has, isShiny, toggleShiny } = useRoster();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"alpha" | "dex">("alpha");

  const filtered = useMemo(() => {
    const list = CHAMPIONS_MB.filter((name) =>
      name.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === "alpha") return [...list].sort((a, b) => a.localeCompare(b));
    return list;
  }, [search, sortBy]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">My Roster</h1>
        <p className="mt-1 text-sm text-gray-500">
          {roster.size} Pokémon selected. Click to mark the ones you own.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Pokémon..."
          className="w-full max-w-sm rounded bg-gray-800 px-4 py-2 text-sm text-white placeholder-gray-600"
        />
        <div className="flex rounded overflow-hidden border border-gray-700 text-sm">
          {(["alpha", "dex"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setSortBy(opt)}
              className={`cursor-pointer px-3 py-2 transition-colors ${
                sortBy === opt
                  ? "bg-blue-700 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-gray-200"
              }`}
            >
              {opt === "alpha" ? "A–Z" : "Dex #"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((name) => {
          const owned = has(name);
          const shiny = isShiny(name);
          return (
            <div key={name} className="relative">
              <button
                onClick={() => toggle(name)}
                className={`flex w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 pr-8 text-left text-sm transition-colors ${
                  shiny
                    ? "border-yellow-500 bg-yellow-900/40 text-yellow-100"
                    : owned
                    ? "border-blue-600 bg-blue-900 text-blue-100"
                    : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-600 hover:text-gray-200"
                }`}
              >
                <PokemonSprite name={name} size={32} />
                <span className="min-w-0">
                  {(() => {
                    const idx = name.indexOf("-");
                    const suffix = idx !== -1 ? name.slice(idx + 1) : "";
                    const isForm = suffix.length > 0 && suffix[0] === suffix[0].toUpperCase() && suffix[0] !== suffix[0].toLowerCase();
                    return (
                      <>
                        <span className="block truncate leading-tight">
                          {isForm ? name.slice(0, idx) : name}
                        </span>
                        {isForm && (
                          <span className="block truncate text-xs opacity-60 leading-tight">
                            {suffix}
                          </span>
                        )}
                      </>
                    );
                  })()}
                </span>
              </button>
              {owned && (
                <button
                  onClick={() => toggleShiny(name)}
                  aria-label={shiny ? "Remove shiny" : "Mark as shiny"}
                  className={`group absolute right-1.5 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded p-1 transition-colors ${
                    shiny
                      ? "text-yellow-300 hover:text-yellow-200"
                      : "text-gray-600 hover:text-yellow-300"
                  }`}
                >
                  <ShinyIcon size={16} />
                  <span className="pointer-events-none absolute bottom-full right-0 z-10 mb-1 whitespace-nowrap rounded bg-gray-950 px-2 py-1 text-xs text-gray-100 opacity-0 shadow-lg ring-1 ring-gray-700 transition-opacity group-hover:opacity-100">
                    {shiny ? "Remove shiny" : "Mark as shiny"}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRoster } from "@/context/RosterContext";

interface Props {
  allPokemon: string[];
}

export function RosterPage({ allPokemon }: Props) {
  const { roster, toggle, has } = useRoster();
  const [search, setSearch] = useState("");

  const filtered = allPokemon.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">My Roster</h1>
        <p className="mt-1 text-sm text-gray-500">
          {roster.size} Pokémon selected. Click to mark the ones you own.
        </p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Pokémon..."
        className="w-full max-w-sm rounded bg-gray-800 px-4 py-2 text-sm text-white placeholder-gray-600"
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((name) => (
          <button
            key={name}
            onClick={() => toggle(name)}
            className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
              has(name)
                ? "border-blue-600 bg-blue-900 text-blue-100"
                : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-600 hover:text-gray-200"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import type { Team } from "@/types";
import { CHAMPIONS_MA } from "@/data/champions-ma";
import { useRoster } from "@/context/RosterContext";
import { getVGCPastesTeams } from "@/lib/vgcpastes";
import {
  computeRecruitment,
  comparePriority,
  comparePopularity,
} from "@/lib/recruitment";
import { PokemonSprite } from "./PokemonSprite";

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export function RecruitmentPageClient() {
  const { roster, shiny, toggle } = useRoster();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"priority" | "popularity">("priority");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getVGCPastesTeams()
      .then(setTeams)
      .catch(() => setError("Could not load teams."))
      .finally(() => setLoading(false));
  }, []);

  const emptyRoster = roster.size === 0;

  const entries = useMemo(
    () => computeRecruitment(CHAMPIONS_MA, teams, roster, shiny),
    [teams, roster, shiny]
  );

  const sorted = useMemo(() => {
    // With an empty Roster there is nothing to personalize, so Priority falls
    // back to raw Popularity.
    const cmp =
      mode === "popularity" || emptyRoster ? comparePopularity : comparePriority;
    const list = [...entries].sort(cmp);
    const q = search.trim().toLowerCase();
    return q ? list.filter((e) => e.name.toLowerCase().includes(q)) : list;
  }, [entries, mode, emptyRoster, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Recruitment</h1>
        <p className="mt-1 text-sm text-gray-500">
          Pokémon you don&apos;t own yet, ranked by how worth recruiting they are.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex overflow-hidden rounded border border-gray-700 text-sm">
          {(["priority", "popularity"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setMode(opt)}
              className={`cursor-pointer px-3 py-2 capitalize transition-colors ${
                mode === opt
                  ? "bg-blue-700 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Pokémon..."
          className="w-full max-w-sm rounded bg-gray-800 px-4 py-2 text-sm text-white placeholder-gray-600"
        />
      </div>

      {emptyRoster && (
        <p className="rounded border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-400">
          Build your <span className="text-gray-200">Roster</span> to get
          personalized recruitment priorities. For now this list is ranked by
          popularity.
        </p>
      )}

      {loading && <p className="text-sm text-gray-500">Loading teams...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {!loading && !error && (
        <>
          <p className="text-sm text-gray-500">{sorted.length} Pokémon to recruit</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((e) => {
              const showCompletions = !emptyRoster && e.completionCount > 0;
              return (
                <div
                  key={e.name}
                  className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2"
                >
                  <PokemonSprite name={e.name} size={36} />
                  <div className="min-w-0 flex-1">
                    {(() => {
                      const idx = e.name.indexOf("-");
                      const suffix = idx !== -1 ? e.name.slice(idx + 1) : "";
                      const isForm =
                        suffix.length > 0 &&
                        suffix[0] === suffix[0].toUpperCase() &&
                        suffix[0] !== suffix[0].toLowerCase();
                      return (
                        <p className="truncate text-sm leading-tight">
                          {isForm ? e.name.slice(0, idx) : e.name}
                          {isForm && (
                            <span className="text-xs opacity-60"> {suffix}</span>
                          )}
                        </p>
                      );
                    })()}
                    <p className="truncate text-xs text-gray-500">
                      {showCompletions && (
                        <span className="text-green-400">
                          Completes {plural(e.completionCount, "team")}
                          {" · "}
                        </span>
                      )}
                      Appears in {plural(e.popularity, "team")}
                    </p>
                  </div>
                  <button
                    onClick={() => toggle(e.name)}
                    className="shrink-0 cursor-pointer rounded border border-gray-700 px-2 py-1 text-xs text-gray-300 transition-colors hover:border-blue-600 hover:bg-blue-900 hover:text-blue-100"
                  >
                    + Add
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

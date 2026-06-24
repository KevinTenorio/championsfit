"use client";

import { useEffect, useMemo, useState } from "react";
import type { Team } from "@/types";
import { getVGCPastesTeams } from "@/lib/vgcpastes";
import { useRoster } from "@/context/RosterContext";
import { computeCoverage, countShinyMembers, canonicalName } from "@/lib/roster";
import { CHAMPIONS_MB } from "@/data/champions-mb";
import { isOfficialTournament } from "@/data/official-tournaments";
import { TeamCard } from "./TeamCard";
import { PokemonFilter } from "./PokemonFilter";
import { PokemonSprite } from "./PokemonSprite";

export function TeamsPageClient() {
  const { roster, shiny } = useRoster();
  const [regulations, setRegulations] = useState<string[]>([]);
  const [regulation, setRegulation] = useState("");
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [threshold, setThreshold] = useState(0);
  const [required, setRequired] = useState<string[]>([]);
  const [banned, setBanned] = useState<string[]>([]);
  const [tournament, setTournament] = useState("");
  const [onlyEVs, setOnlyEVs] = useState(false);
  const [onlyRental, setOnlyRental] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => {
    getVGCPastesTeams()
      .then((teams) => {
        setAllTeams(teams);
        const regs = [...new Set(teams.map((t) => t.regulation))];
        setRegulations(regs);
        setRegulation(regs[0] ?? "M-B");
      })
      .catch(() => setError("Could not load teams."))
      .finally(() => setLoading(false));
  }, []);

  const pokemonOptions = useMemo(
    () => [...CHAMPIONS_MB].sort(),
    []
  );

  const tournamentOptions = useMemo(
    () =>
      [
        ...new Set(
          allTeams
            .filter((t) => t.regulation === regulation)
            .map((t) => t.tournamentName)
            .filter((n) => n && n !== "-")
        ),
      ].sort((a, b) => {
        const aOff = isOfficialTournament(a) ? 0 : 1;
        const bOff = isOfficialTournament(b) ? 0 : 1;
        if (aOff !== bOff) return aOff - bOff;
        return a.localeCompare(b);
      }),
    [allTeams, regulation]
  );

  // Reset to page 1 whenever any filter changes
  useEffect(() => { setPage(1); }, [regulation, tournament, onlyEVs, onlyRental, onlyFeatured, required, banned, threshold]);

  const filtered = useMemo(() => {
    return allTeams
      .filter((t) => t.regulation === regulation)
      .filter((t) => !tournament || t.tournamentName === tournament)
      .filter((t) => !onlyEVs || t.hasEVs)
      .filter((t) => !onlyRental || !!t.rentalCode)
      .filter((t) => !onlyFeatured || !!t.featured)
      .filter((t) =>
        required.every((r) => t.members.some((m) => canonicalName(m.name).toLowerCase() === r.toLowerCase()))
      )
      .filter((t) =>
        banned.every((b) => !t.members.some((m) => canonicalName(m.name).toLowerCase() === b.toLowerCase()))
      )
      .map((t) => ({
        ...t,
        rosterCoverage: computeCoverage(roster, t.members.map((m) => m.name)),
        shinyCount: countShinyMembers(shiny, t.members.map((m) => m.name)),
      }))
      .filter((t) => roster.size === 0 || threshold === 0 || t.rosterCoverage >= threshold / 6)
      .sort((a, b) => {
        const covDiff = b.rosterCoverage - a.rosterCoverage;
        if (covDiff !== 0) return covDiff;
        // Within equal coverage, more owned-shiny members ranks higher...
        const shinyDiff = b.shinyCount - a.shinyCount;
        if (shinyDiff !== 0) return shinyDiff;
        // ...then prestige. Featured (deliberate curation) outranks Official
        // (event pedigree); a team carrying both badges tops the tie-break.
        const priority = (t: typeof a) => {
          const official = isOfficialTournament(t.tournamentName);
          if (t.featured && official) return 0;
          if (t.featured) return 1;
          if (official) return 2;
          return 3;
        };
        return priority(a) - priority(b);
      });
  }, [allTeams, regulation, tournament, onlyEVs, onlyRental, onlyFeatured, required, banned, roster, shiny, threshold]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-xs text-gray-400">Regulation</label>
          <select
            value={regulation}
            onChange={(e) => { setRegulation(e.target.value); setTournament(""); }}
            className="rounded bg-gray-800 px-3 py-2 text-sm text-white"
          >
            {regulations.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-400">Tournament</label>
          <select
            value={tournament}
            onChange={(e) => setTournament(e.target.value)}
            className="rounded bg-gray-800 px-3 py-2 text-sm text-white max-w-48"
          >
            <option value="">All</option>
            {tournamentOptions.map((t) => (
              <option key={t} value={t}>{isOfficialTournament(t) ? `★ ${t}` : t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-400">
            Minimum roster coverage ({threshold}/6)
          </label>
          <input
            type="range"
            min={0}
            max={6}
            step={1}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-40"
          />
        </div>

        <PokemonFilter label="Required Pokémon" value={required} onChange={setRequired} options={pokemonOptions} />
        <PokemonFilter label="Banned Pokémon" value={banned} onChange={setBanned} options={pokemonOptions} />

        <div className="flex flex-col gap-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={onlyFeatured}
              onChange={(e) => setOnlyFeatured(e.target.checked)}
              className="rounded accent-blue-500"
            />
            Featured only
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={onlyEVs}
              onChange={(e) => setOnlyEVs(e.target.checked)}
              className="rounded accent-blue-500"
            />
            With EVs
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={onlyRental}
              onChange={(e) => setOnlyRental(e.target.checked)}
              className="rounded accent-blue-500"
            />
            With rental code
          </label>
        </div>
      </div>

      {(required.length > 0 || banned.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {required.map((v) => (
            <button
              key={v}
              onClick={() => setRequired(required.filter((x) => x !== v))}
              title={`Remove required: ${v}`}
              className="flex flex-col items-center gap-0.5 rounded border border-green-800 bg-green-950 px-1.5 py-1 hover:border-red-700 hover:bg-red-950 transition-colors group"
            >
              <PokemonSprite name={v} size={36} />
              <span className="text-xs text-green-400 group-hover:text-red-400 leading-tight">{v.includes("-") ? v.slice(0, v.indexOf("-")) : v}</span>
            </button>
          ))}
          {banned.map((v) => (
            <button
              key={v}
              onClick={() => setBanned(banned.filter((x) => x !== v))}
              title={`Remove banned: ${v}`}
              className="flex flex-col items-center gap-0.5 rounded border border-red-800 bg-red-950 px-1.5 py-1 hover:opacity-60 transition-opacity"
            >
              <PokemonSprite name={v} size={36} />
              <span className="text-xs text-red-400 leading-tight">{v.includes("-") ? v.slice(0, v.indexOf("-")) : v}</span>
            </button>
          ))}
        </div>
      )}

      {loading && <p className="text-sm text-gray-500">Loading teams...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!loading && !error && (
        <>
          <p className="text-sm text-gray-500">{filtered.length} teams found</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
          {filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded bg-gray-800 px-3 py-1.5 text-sm text-gray-300 disabled:opacity-30 hover:bg-gray-700"
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-500">
                {page} / {Math.ceil(filtered.length / PAGE_SIZE)}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(Math.ceil(filtered.length / PAGE_SIZE), p + 1))}
                disabled={page === Math.ceil(filtered.length / PAGE_SIZE)}
                className="rounded bg-gray-800 px-3 py-1.5 text-sm text-gray-300 disabled:opacity-30 hover:bg-gray-700"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

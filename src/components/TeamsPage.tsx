"use client";

import { useMemo, useState } from "react";
import type { Team } from "@/types";
import { useRoster } from "@/context/RosterContext";
import { computeCoverage } from "@/lib/roster";
import { TeamCard } from "./TeamCard";
import { PokemonFilter } from "./PokemonFilter";

interface Props {
  teams: Team[];
  regulations: string[];
  defaultRegulation: string;
}

export function TeamsPage({ teams, regulations, defaultRegulation }: Props) {
  const { roster } = useRoster();
  const [regulation, setRegulation] = useState(defaultRegulation);
  const [threshold, setThreshold] = useState(0);
  const [required, setRequired] = useState<string[]>([]);
  const [banned, setBanned] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return teams
      .filter((t) => t.regulation === regulation)
      .filter((t) =>
        required.every((r) => t.members.some((m) => m.name.toLowerCase() === r.toLowerCase()))
      )
      .filter((t) =>
        banned.every((b) => !t.members.some((m) => m.name.toLowerCase() === b.toLowerCase()))
      )
      .map((t) => ({
        ...t,
        rosterCoverage: computeCoverage(roster, t.members.map((m) => m.name)),
      }))
      .filter((t) => roster.size === 0 || t.rosterCoverage >= threshold / 6)
      .sort((a, b) => b.rosterCoverage - a.rosterCoverage);
  }, [teams, regulation, required, banned, roster, threshold]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-xs text-gray-400">Regulation</label>
          <select
            value={regulation}
            onChange={(e) => setRegulation(e.target.value)}
            className="rounded bg-gray-800 px-3 py-2 text-sm text-white"
          >
            {regulations.map((r) => (
              <option key={r} value={r}>{r}</option>
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

        <PokemonFilter
          label="Required Pokémon"
          value={required}
          onChange={setRequired}
        />
        <PokemonFilter
          label="Banned Pokémon"
          value={banned}
          onChange={setBanned}
        />
      </div>

      <p className="text-sm text-gray-500">{filtered.length} teams found</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import type { Team } from "@/types";
import { useRoster } from "@/context/RosterContext";
import { PokemonSprite } from "./PokemonSprite";
import { isOfficialTournament } from "@/data/official-tournaments";

interface Props {
  team: Team;
}

export function TeamCard({ team }: Props) {
  const { has, isShiny, roster } = useRoster();
  const covered = team.members.filter((m) => has(m.name)).length;
  const pct = roster.size > 0 ? Math.round((covered / 6) * 100) : null;
  const official = isOfficialTournament(team.tournamentName);
  const featured = !!team.featured;

  return (
    <Link
      href={`/time/${team.id}`}
      className={`block rounded-lg border p-4 hover:border-gray-600 transition-colors ${official ? "border-yellow-700/60 bg-yellow-950/20" : featured ? "border-blue-700/60 bg-blue-950/20" : "border-gray-800 bg-gray-900"}`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-xs text-gray-500 truncate">{team.tournamentName}</p>
            {official && (
              <span className="shrink-0 rounded bg-yellow-800/60 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-300">
                Official
              </span>
            )}
            {featured && !official && (
              <span className="shrink-0 rounded bg-blue-800/60 px-1.5 py-0.5 text-[10px] font-semibold text-blue-300">
                Featured
              </span>
            )}
          </div>
          <p className="text-sm font-medium">{team.playerName}</p>
          {team.rankLabel && <p className="text-xs text-gray-500">{team.rankLabel}</p>}
        </div>
        {pct !== null && (
          <span
            className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${
              pct === 100
                ? "bg-green-900 text-green-300"
                : pct >= 66
                ? "bg-yellow-900 text-yellow-300"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            {covered}/6
          </span>
        )}
      </div>

      <div className="grid grid-cols-6 gap-1">
        {team.members.map((m) => {
          const shiny = isShiny(m.name);
          const owned = has(m.name);
          return (
            <div
              key={m.name}
              title={shiny ? `${m.name} (shiny)` : m.name}
              className={`relative rounded p-0.5 ${
                shiny
                  ? "bg-yellow-900/50 ring-1 ring-yellow-500"
                  : owned
                  ? "bg-blue-900/60 ring-1 ring-blue-700"
                  : "bg-gray-800/60"
              }`}
            >
              <PokemonSprite name={m.name} className="w-full aspect-square" />
              {shiny && (
                <span className="absolute -right-0.5 -top-1 text-[11px] leading-none text-yellow-300 drop-shadow">
                  ★
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Link>
  );
}

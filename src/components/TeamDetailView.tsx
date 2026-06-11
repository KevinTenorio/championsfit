"use client";

import Link from "next/link";
import type { Team } from "@/types";
import { useRoster } from "@/context/RosterContext";

interface Props {
  team: Team;
}

export function TeamDetailView({ team }: Props) {
  const { has, isShiny } = useRoster();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300">
          ← Back to teams
        </Link>
        <h1 className="mt-2 text-xl font-bold">{team.playerName}</h1>
        <p className="text-sm text-gray-500">
          {team.tournamentName} · #{team.placement} · {team.regulation}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {team.members.map((m) => {
          const owned = has(m.name);
          const shiny = isShiny(m.name);
          return (
          <div
            key={m.name}
            className={`rounded-lg border p-4 ${
              shiny
                ? "border-yellow-600 bg-yellow-950/40"
                : owned
                ? "border-blue-700 bg-blue-950"
                : "border-gray-800 bg-gray-900"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold">{m.name}</h2>
              {shiny ? (
                <span className="text-xs text-yellow-300">★ shiny</span>
              ) : owned ? (
                <span className="text-xs text-blue-400">no roster</span>
              ) : null}
            </div>
            <dl className="space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="text-gray-500 w-16 shrink-0">Item</dt>
                <dd>{m.item || "—"}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-gray-500 w-16 shrink-0">Ability</dt>
                <dd>{m.ability || "—"}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-gray-500 w-16 shrink-0">Nature</dt>
                <dd>{m.nature || "—"}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-gray-500 w-16 shrink-0">Moves</dt>
                <dd>
                  <ul className="space-y-0.5">
                    {m.moves.map((move) => (
                      <li key={move}>{move}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
          );
        })}
      </div>
    </div>
  );
}

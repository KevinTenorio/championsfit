"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Team, TeamMember } from "@/types";
import { getVGCPastesTeams } from "@/lib/vgcpastes";
import { fetchPaste, NATURE_STATS } from "@/lib/pokepaste";
import { useRoster } from "@/context/RosterContext";
import { canonicalName } from "@/lib/roster";
import { PokemonSprite, ItemSprite } from "./PokemonSprite";

interface Props {
  teamId: string;
}

const EV_ORDER = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];

function formatEvs(evs: Partial<Record<string, number>> | undefined): string {
  if (!evs || Object.keys(evs).length === 0) return "—";
  return EV_ORDER
    .filter((s) => evs[s])
    .map((s) => `${evs[s]} ${s}`)
    .join(" / ");
}

function MemberCard({ member, inRoster }: { member: TeamMember; inRoster: boolean }) {
  const hasBuild = member.ability || member.moves.length > 0;

  return (
    <div className={`rounded-lg border p-4 ${inRoster ? "border-blue-700 bg-blue-950" : "border-gray-800 bg-gray-900"}`}>
      <div className="flex items-center gap-3 mb-3">
        <PokemonSprite name={member.name} size={64} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <h2 className="truncate font-semibold">{canonicalName(member.name)}</h2>
            {inRoster && <span className="shrink-0 text-xs text-blue-400">in roster</span>}
          </div>
          {member.item && (
            <div className="mt-1 flex items-center gap-1.5">
              <ItemSprite name={member.item} />
              <span className="text-xs text-gray-400">{member.item}</span>
            </div>
          )}
        </div>
      </div>

      {hasBuild ? (
        <dl className="space-y-1.5 text-sm">
          {member.ability && (
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-gray-500">Ability</dt>
              <dd className="text-gray-200">{member.ability}</dd>
            </div>
          )}
          {member.nature && (
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-gray-500">Nature</dt>
              <dd className="text-gray-200">
                {member.nature}
                {NATURE_STATS[member.nature] && (
                  <span className="ml-1.5 text-xs text-gray-500">
                    (+{NATURE_STATS[member.nature].plus}, -{NATURE_STATS[member.nature].minus})
                  </span>
                )}
              </dd>
            </div>
          )}
          {member.evs && Object.keys(member.evs).length > 0 && (
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-gray-500">EVs</dt>
              <dd className="text-gray-200">{formatEvs(member.evs)}</dd>
            </div>
          )}
          {member.moves.length > 0 && (
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-gray-500">Moves</dt>
              <dd>
                <ul className="space-y-0.5">
                  {member.moves.map((move) => (
                    <li key={move} className="text-gray-200">{move}</li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      ) : (
        <p className="text-xs text-gray-600">No paste available</p>
      )}
    </div>
  );
}

export function TeamDetailClient({ teamId }: Props) {
  const { has } = useRoster();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVGCPastesTeams().then(async (teams) => {
      const found = teams.find((t) => t.id === teamId) ?? null;
      if (found?.pasteUrl) {
        const pasteMembers = await fetchPaste(found.pasteUrl);
        if (pasteMembers) {
          const norm = (s: string) =>
            s.toLowerCase()
              .replace(/\s*\([mf]\)/gi, "")
              .replace(/-mega(-[xy])?$/i, "")
              .replace(/[^a-z0-9]/g, "");
          const enriched = found.members.map((m) => {
            const mn = norm(m.name);
            const match = pasteMembers.find((p) => {
              const pn = norm(p.name);
              return pn === mn || pn.startsWith(mn) || mn.startsWith(pn);
            });
            if (!match) return m;
            return {
              ...m,
              ability: match.ability || m.ability,
              nature: match.nature || m.nature,
              moves: match.moves.length ? match.moves : m.moves,
              evs: match.evs,
            };
          });
          setTeam({ ...found, members: enriched });
          return;
        }
      }
      setTeam(found);
    }).finally(() => setLoading(false));
  }, [teamId]);

  if (loading) return <p className="text-sm text-gray-500">Loading team...</p>;
  if (!team) return <p className="text-sm text-red-400">Team not found.</p>;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300">
          ← Back to teams
        </Link>
        <h1 className="mt-2 text-xl font-bold">{team.playerName}</h1>
        <p className="text-sm text-gray-500">
          {team.tournamentName}
          {team.rankLabel ? ` · ${team.rankLabel}` : ""}
          {" · "}{team.regulation}
          {team.dateShared ? ` · ${team.dateShared}` : ""}
        </p>
        {team.owner && (
          <p className="text-xs text-gray-600">by {team.owner}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <a
            href={`https://docs.google.com/spreadsheets/d/1axlwmzPA49rYkqXh7zHvAtSP-TKbM0ijGYBPRflLSWw`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            VGCPastes ↗
          </a>
          {team.pasteUrl && (
            <a href={team.pasteUrl} target="_blank" rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300">
              Pokepaste ↗
            </a>
          )}
          {team.sourceUrl && (
            <a href={team.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300">
              Source ↗
            </a>
          )}
          {team.videoUrl && (
            <a href={team.videoUrl} target="_blank" rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300">
              Report / Video ↗
            </a>
          )}
          {team.otherLinks && (
            <a href={team.otherLinks} target="_blank" rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300">
              Other link ↗
            </a>
          )}
          {team.rentalCode && (
            <span className="rounded bg-gray-800 px-2 py-0.5 font-mono text-sm text-gray-200">
              {team.rentalCode}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {team.members.map((m) => (
          <MemberCard key={m.name} member={m} inRoster={has(m.name)} />
        ))}
      </div>
    </div>
  );
}

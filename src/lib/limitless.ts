import type { Team } from "@/types";

const BASE_URL = "https://play.limitlesstcg.com/api";

interface LimitlessTournament {
  id: string;
  name: string;
  format: string;
  date: string;
  players: number;
}

interface LimitlessTeamMember {
  name: string;
  item: string;
  ability: string;
  attacks: string[];
  nature: string;
}

interface LimitlessStanding {
  name: string;
  placing: number;
  decklist: LimitlessTeamMember[] | null;
}

interface LimitlessGame {
  id: string;
  formats: Record<string, string>;
}

export async function getRegulations(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/games`);
  if (!res.ok) throw new Error("Failed to fetch games");
  const games: LimitlessGame[] = await res.json();
  const vgc = games.find((g) => g.id === "VGC");
  return vgc ? Object.keys(vgc.formats) : [];
}

const TOURNAMENT_LIMIT = 20;
const CONCURRENT_REQUESTS = 5;

export async function getTournaments(regulation: string): Promise<LimitlessTournament[]> {
  const res = await fetch(
    `${BASE_URL}/tournaments?game=VGC&format=${encodeURIComponent(regulation)}&limit=${TOURNAMENT_LIMIT}`
  );
  if (!res.ok) throw new Error("Failed to fetch tournaments");
  return res.json();
}

async function getTeamsFromTournament(tournament: LimitlessTournament): Promise<Team[]> {
  const res = await fetch(`${BASE_URL}/tournaments/${tournament.id}/standings`);
  if (!res.ok) return [];
  const standings: LimitlessStanding[] = await res.json();

  return standings
    .filter((s) => s.decklist && s.decklist.length === 6)
    .map((s) => ({
      id: `${tournament.id}-${s.placing ?? s.name}`,
      tournamentId: tournament.id,
      tournamentName: tournament.name,
      regulation: tournament.format,
      playerName: s.name,
      placement: s.placing,
      members: s.decklist!.map((m) => ({
        name: m.name,
        item: m.item,
        ability: m.ability,
        moves: m.attacks,
        nature: m.nature,
      })),
    }));
}

export async function getTeams(regulation: string): Promise<Team[]> {
  const tournaments = await getTournaments(regulation);
  const results: Team[] = [];
  for (let i = 0; i < tournaments.length; i += CONCURRENT_REQUESTS) {
    const batch = tournaments.slice(i, i + CONCURRENT_REQUESTS);
    const batchResults = await Promise.all(batch.map(getTeamsFromTournament));
    results.push(...batchResults.flat());
  }
  return results;
}

import type { Team } from "@/types";
import { canonicalName } from "./roster";

// Tunable weighting constants for Recruitment Priority. Applied only to the
// priority score (never to raw Popularity). See CONTEXT.md → Recruitment Priority.
export const FEATURED_WEIGHT = 1.5; // Featured teams count for more
export const SHINY_WEIGHT_PER_MEMBER = 0.25; // +25% per owned-shiny member in the team

export interface RecruitmentEntry {
  name: string;
  /** Raw number of teams the Pokémon appears in (Popularity, unweighted). */
  popularity: number;
  /** Raw number of teams the Pokémon would complete to 6/6 (shown to the user). */
  completionCount: number;
  /** Weighted completions — primary priority key (completion has absolute priority). */
  completionScore: number;
  /** Convex weighted sum of partial coverage gains — priority tie-breaker. */
  partialScore: number;
}

// A team's weight in the priority score: more for Featured teams and for teams
// where the user already owns members as Shiny. Multiplicative.
function teamWeight(team: Team, shiny: Set<string>): number {
  const featured = team.featured ? FEATURED_WEIGHT : 1;
  const shinyCount = team.members.filter((m) => shiny.has(canonicalName(m.name))).length;
  return featured * (1 + SHINY_WEIGHT_PER_MEMBER * shinyCount);
}

// Builds a recruitment entry for every Pokémon the user does NOT own, scoring
// each by how valuable recruiting it would be. Pokémon that appear in no team
// stay at zero (they sink to the bottom).
export function computeRecruitment(
  allPokemon: string[],
  teams: Team[],
  roster: Set<string>,
  shiny: Set<string>
): RecruitmentEntry[] {
  const entries = new Map<string, RecruitmentEntry>();
  for (const name of allPokemon) {
    if (!roster.has(name)) {
      entries.set(name, {
        name,
        popularity: 0,
        completionCount: 0,
        completionScore: 0,
        partialScore: 0,
      });
    }
  }

  for (const team of teams) {
    const w = teamWeight(team, shiny);
    const memberCanon = team.members.map((m) => canonicalName(m.name));
    const ownedInTeam = memberCanon.filter((c) => roster.has(c)).length;

    for (const c of memberCanon) {
      const entry = entries.get(c);
      if (!entry) continue; // owned, or not a known recruitable target
      // The Pokémon `c` is not owned, so ownedInTeam already counts only its
      // teammates. Recruiting it moves the team from ownedInTeam/6 to +1.
      entry.popularity += 1;
      if (ownedInTeam === team.members.length - 1) {
        entry.completionCount += 1;
        entry.completionScore += w;
      } else {
        entry.partialScore += Math.pow(2, ownedInTeam) * w;
      }
    }
  }

  return [...entries.values()];
}

export function comparePriority(a: RecruitmentEntry, b: RecruitmentEntry): number {
  if (b.completionScore !== a.completionScore) return b.completionScore - a.completionScore;
  if (b.partialScore !== a.partialScore) return b.partialScore - a.partialScore;
  if (b.popularity !== a.popularity) return b.popularity - a.popularity;
  return a.name.localeCompare(b.name);
}

export function comparePopularity(a: RecruitmentEntry, b: RecruitmentEntry): number {
  if (b.popularity !== a.popularity) return b.popularity - a.popularity;
  if (b.completionScore !== a.completionScore) return b.completionScore - a.completionScore;
  if (b.partialScore !== a.partialScore) return b.partialScore - a.partialScore;
  return a.name.localeCompare(b.name);
}

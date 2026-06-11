const STORAGE_KEY = "champions-roster";
const SHINY_STORAGE_KEY = "champions-roster-shiny";

// Mega Evolution forms are not separate roster entries — owning the base Pokémon
// implies owning the Mega form (the Mega Stone item triggers it during battle).
export function baseName(name: string): string {
  return name.replace(/-Mega(-[XY])?$/i, "");
}

// VGCPastes uses the base form name for some Pokémon that have mandatory gender forms
// in our roster. Map VGCPastes names to the canonical roster name.
const VGCPASTES_TO_ROSTER: Record<string, string> = {
  Basculegion: "Basculegion-Male",
  Meowstic: "Meowstic-Male",
  "Basculegion-F": "Basculegion-Female",
  "Meowstic-F": "Meowstic-Female",
  // Aesthetic forms — mechanically identical to the base form
  "Maushold-Four": "Maushold",
  "Sinistcha-Masterpiece": "Sinistcha",
};

export function canonicalName(name: string): string {
  const base = baseName(name);
  return VGCPASTES_TO_ROSTER[base] ?? base;
}

export function getRoster(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function saveRoster(roster: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...roster]));
}

export function togglePokemon(roster: Set<string>, name: string): Set<string> {
  const next = new Set(roster);
  if (next.has(name)) {
    next.delete(name);
  } else {
    next.add(name);
  }
  return next;
}

export function computeCoverage(roster: Set<string>, teamNames: string[]): number {
  if (roster.size === 0) return 0;
  const owned = teamNames.filter((n) => roster.has(canonicalName(n))).length;
  return owned / teamNames.length;
}

// Shiny marks are stored by canonical name and are always a subset of the roster
// (shiny implies owned). Persisted separately so existing rosters keep working.
export function getShiny(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(SHINY_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function saveShiny(shiny: Set<string>): void {
  localStorage.setItem(SHINY_STORAGE_KEY, JSON.stringify([...shiny]));
}

// Number of a team's members that the user owns as shiny. A shiny member is always
// a covered member, so this is a tie-breaker within equal coverage — never above it.
export function countShinyMembers(shiny: Set<string>, teamNames: string[]): number {
  if (shiny.size === 0) return 0;
  return teamNames.filter((n) => shiny.has(canonicalName(n))).length;
}

export const OFFICIAL_TOURNAMENTS: ReadonlySet<string> = new Set([
  "Turin SPE 2026",
  "Indianapolis Regional 2026",
]);

export function isOfficialTournament(name: string): boolean {
  return OFFICIAL_TOURNAMENTS.has(name);
}

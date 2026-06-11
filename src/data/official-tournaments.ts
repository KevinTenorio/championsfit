export const OFFICIAL_TOURNAMENTS: ReadonlySet<string> = new Set([
  "Turin SPE 2026",
  "Indianapolis Regional 2026",
  "PJCS 2026",
  "Singapore MBL 2026",
  "Korea PTC 2026",
  "Thailand MBL 2026",
  "Malaysia MBL 2026"
]);

export function isOfficialTournament(name: string): boolean {
  return OFFICIAL_TOURNAMENTS.has(name);
}

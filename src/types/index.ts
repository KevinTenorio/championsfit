export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

export interface TeamMember {
  name: string;
  item: string;
  ability: string;
  moves: string[];
  nature: string;
  evs?: Partial<Record<string, number>>;
}

export interface Team {
  id: string;
  tournamentId: string;
  tournamentName: string;
  regulation: string;
  playerName: string;
  placement: number;
  rankLabel?: string;
  pasteUrl?: string;
  rentalCode?: string;
  sourceUrl?: string;
  videoUrl?: string;
  otherLinks?: string;
  dateShared?: string;
  owner?: string;
  hasEVs?: boolean;
  featured?: boolean;
  members: TeamMember[];
  rosterCoverage?: number;
}

export interface Roster {
  pokemonIds: Set<string>;
}

export type RegulationCode = string;

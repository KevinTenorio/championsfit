import type { TeamMember } from "@/types";

// +stat / -stat for each nature. Neutral natures omitted.
export const NATURE_STATS: Record<string, { plus: string; minus: string }> = {
  Lonely:  { plus: "Atk",  minus: "Def"  },
  Brave:   { plus: "Atk",  minus: "Spe"  },
  Adamant: { plus: "Atk",  minus: "SpA"  },
  Naughty: { plus: "Atk",  minus: "SpD"  },
  Bold:    { plus: "Def",  minus: "Atk"  },
  Relaxed: { plus: "Def",  minus: "Spe"  },
  Impish:  { plus: "Def",  minus: "SpA"  },
  Lax:     { plus: "Def",  minus: "SpD"  },
  Modest:  { plus: "SpA",  minus: "Atk"  },
  Mild:    { plus: "SpA",  minus: "Def"  },
  Quiet:   { plus: "SpA",  minus: "Spe"  },
  Rash:    { plus: "SpA",  minus: "SpD"  },
  Calm:    { plus: "SpD",  minus: "Atk"  },
  Gentle:  { plus: "SpD",  minus: "Def"  },
  Sassy:   { plus: "SpD",  minus: "Spe"  },
  Careful: { plus: "SpD",  minus: "SpA"  },
  Timid:   { plus: "Spe",  minus: "Atk"  },
  Hasty:   { plus: "Spe",  minus: "Def"  },
  Jolly:   { plus: "Spe",  minus: "SpA"  },
  Naive:   { plus: "Spe",  minus: "SpD"  },
};

interface PokepasteMember extends Omit<TeamMember, "evs"> {
  evs: Partial<Record<string, number>>;
}

function parseEvs(line: string): Partial<Record<string, number>> {
  const raw = line.replace(/^EVs:\s*/i, "");
  const evs: Partial<Record<string, number>> = {};
  for (const part of raw.split("/")) {
    const m = part.trim().match(/^(\d+)\s+(.+)$/);
    if (m) evs[m[2].trim()] = Number(m[1]);
  }
  return evs;
}

function parseBlock(block: string): PokepasteMember | null {
  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return null;

  // First line: "Name @ Item" or just "Name"
  const firstLine = lines[0];
  const atIdx = firstLine.indexOf(" @ ");
  const name = atIdx !== -1 ? firstLine.slice(0, atIdx).trim() : firstLine.trim();
  const item = atIdx !== -1 ? firstLine.slice(atIdx + 3).trim() : "";

  let ability = "";
  let nature = "";
  let evs: Partial<Record<string, number>> = {};
  const moves: string[] = [];

  for (const line of lines.slice(1)) {
    if (line.startsWith("Ability:")) {
      ability = line.replace(/^Ability:\s*/i, "").trim();
    } else if (line.match(/Nature$/i)) {
      nature = line.replace(/\s*Nature$/i, "").trim();
    } else if (line.startsWith("EVs:")) {
      evs = parseEvs(line);
    } else if (line.startsWith("- ")) {
      moves.push(line.slice(2).trim());
    }
  }

  return { name, item, ability, nature, evs, moves };
}

export function parseShowdownPaste(paste: string): PokepasteMember[] {
  return paste
    .split(/\n\s*\n/)
    .map((block) => parseBlock(block.trim()))
    .filter((m): m is PokepasteMember => m !== null && m.name.length > 0);
}

export async function fetchPaste(pasteUrl: string): Promise<PokepasteMember[] | null> {
  try {
    const jsonUrl = pasteUrl.replace(/\/$/, "") + "/json";
    const res = await fetch(jsonUrl);
    if (!res.ok) return null;
    const data = (await res.json()) as { paste?: string };
    if (!data.paste) return null;
    return parseShowdownPaste(data.paste);
  } catch {
    return null;
  }
}

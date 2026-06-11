import type { Team } from "@/types";

const SHEET_ID = "1axlwmzPA49rYkqXh7zHvAtSP-TKbM0ijGYBPRflLSWw";
const SHEET_NAME = "Champions M-A";
const FEATURED_SHEET_NAME = "Champions M-A Featured Teams";
const REGULATION = "M-A";

// Column indices (0-based) in the gviz response
const COL_ID = 0;             // A — Team ID
const COL_DESC = 1;           // B — Team description
const COL_TRAINER = 3;        // D — Full name
const COL_PASTE = 24;         // Y — Pokepaste URL
const COL_RENTAL_STATUS = 27; // AB — Replica status (✔ = available)
const COL_RENTAL_CODE = 28;   // AC — Rental/Replica code
const COL_DATE = 29;          // AD — Date shared
const COL_EVENT = 30;         // AE — Tournament / Event
const COL_RANK = 31;          // AF — Rank
const COL_SOURCE = 32;        // AG — Link to source
const COL_VIDEO = 33;         // AH — Report / Video
const COL_OTHER = 34;         // AI — Other links
const COL_OWNER = 35;         // AJ — Owner
const COL_ITEM1 = 7;          // H — Item for Pokémon 1 (pattern: 7 + i*3)
const COL_EVS = 25;           // Z — EVs available ("Yes" / "No")
const COL_P1 = 37;            // AL — Pokémon 1
const COL_P6 = 42;            // AQ — Pokémon 6

interface GvizCell {
  v: string | number | null;
}

interface GvizRow {
  c: (GvizCell | null)[];
}

function cell(row: GvizRow, index: number): string {
  const val = row.c[index]?.v;
  if (val == null) return "";
  // gviz returns dates as "Date(yyyy,m,d)" — convert to readable string
  if (typeof val === "string" && val.startsWith("Date(")) {
    const parts = val.slice(5, -1).split(",").map(Number);
    const [y, m, d] = parts;
    return new Date(y, m, d).toLocaleDateString("pt-BR", { year: "numeric", month: "short", day: "numeric" });
  }
  return String(val).trim();
}

async function getFeaturedIds(): Promise<Set<string>> {
  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq` +
    `?tqx=out:json&sheet=${encodeURIComponent(FEATURED_SHEET_NAME)}&range=A:A`;

  try {
    const res = await fetch(url);
    if (!res.ok) return new Set();
    const text = await res.text();
    const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const data = JSON.parse(json) as { table: { rows: GvizRow[] } };
    return new Set(
      data.table.rows
        .map((row) => cell(row, 0))
        .filter((id) => id.startsWith("PC"))
    );
  } catch {
    return new Set();
  }
}

export async function getVGCPastesTeams(): Promise<Team[]> {
  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq` +
    `?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}&range=A4:AQ`;

  const [res, featuredIds] = await Promise.all([fetch(url), getFeaturedIds()]);
  if (!res.ok) throw new Error("Failed to fetch VGCPastes");

  // Google wraps the JSON in a callback: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
  const text = await res.text();
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  const data = JSON.parse(json) as { table: { rows: GvizRow[] } };

  return data.table.rows
    .filter((row) => {
      const id = cell(row, COL_ID);
      return id.startsWith("PC");
    })
    .map((row) => {
      const members = Array.from({ length: 6 }, (_, i) => ({
        name: cell(row, COL_P1 + i),
        item: cell(row, COL_ITEM1 + i * 3),
        ability: "",
        moves: [],
        nature: "",
      })).filter((m) => m.name);

      const rentalCode = cell(row, COL_RENTAL_CODE);

      function urlOrUndef(raw: string) {
        return raw.startsWith("http") ? raw : undefined;
      }

      return {
        id: cell(row, COL_ID),
        tournamentId: "",
        tournamentName: cell(row, COL_EVENT),
        regulation: REGULATION,
        playerName: cell(row, COL_TRAINER) || cell(row, COL_DESC),
        placement: 0,
        rankLabel: cell(row, COL_RANK),
        pasteUrl: cell(row, COL_PASTE) || undefined,
        rentalCode: rentalCode && rentalCode !== "None" ? rentalCode : undefined,
        sourceUrl: urlOrUndef(cell(row, COL_SOURCE)),
        videoUrl: urlOrUndef(cell(row, COL_VIDEO)),
        otherLinks: urlOrUndef(cell(row, COL_OTHER)),
        dateShared: cell(row, COL_DATE) || undefined,
        owner: cell(row, COL_OWNER) || undefined,
        hasEVs: cell(row, COL_EVS) === "Yes",
        featured: featuredIds.has(cell(row, COL_ID)),
        members,
      };
    })
    .filter((t) => t.members.length === 6);
}

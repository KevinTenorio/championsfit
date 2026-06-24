import type { Team } from "@/types";

const SHEET_ID = "1axlwmzPA49rYkqXh7zHvAtSP-TKbM0ijGYBPRflLSWw";

// Column indices (0-based) in the gviz response
const COL_ID = 0;
const COL_DESC = 1;
const COL_TRAINER = 3;
const COL_PASTE = 24;
const COL_RENTAL_CODE = 28;
const COL_DATE = 29;
const COL_EVENT = 30;
const COL_RANK = 31;
const COL_SOURCE = 32;
const COL_VIDEO = 33;
const COL_OTHER = 34;
const COL_OWNER = 35;
const COL_ITEM1 = 7;
const COL_EVS = 25;
const COL_P1 = 37;

interface RegulationConfig {
  sheetName: string;
  featuredSheetName: string | null;
  regulation: string;
  idPrefix: string;
}

const REGULATIONS: RegulationConfig[] = [
  {
    sheetName: "Champions M-B",
    featuredSheetName: null,
    regulation: "M-B",
    idPrefix: "MB",
  },
  {
    sheetName: "Champions M-A",
    featuredSheetName: "Champions M-A Featured Teams",
    regulation: "M-A",
    idPrefix: "PC",
  },
];

interface GvizCell {
  v: string | number | null;
}

interface GvizRow {
  c: (GvizCell | null)[];
}

function cell(row: GvizRow, index: number): string {
  const val = row.c[index]?.v;
  if (val == null) return "";
  if (typeof val === "string" && val.startsWith("Date(")) {
    const parts = val.slice(5, -1).split(",").map(Number);
    const [y, m, d] = parts;
    return new Date(y, m, d).toLocaleDateString("pt-BR", { year: "numeric", month: "short", day: "numeric" });
  }
  return String(val).trim();
}

async function getFeaturedIds(featuredSheetName: string): Promise<Set<string>> {
  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq` +
    `?tqx=out:json&sheet=${encodeURIComponent(featuredSheetName)}&range=A:A`;

  try {
    const res = await fetch(url);
    if (!res.ok) return new Set();
    const text = await res.text();
    const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const data = JSON.parse(json) as { table: { rows: GvizRow[] } };
    return new Set(
      data.table.rows
        .map((row) => cell(row, 0))
        .filter(Boolean)
    );
  } catch {
    return new Set();
  }
}

async function fetchRegulation(config: RegulationConfig): Promise<Team[]> {
  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq` +
    `?tqx=out:json&sheet=${encodeURIComponent(config.sheetName)}&range=A4:AQ`;

  const [res, featuredIds] = await Promise.all([
    fetch(url),
    config.featuredSheetName ? getFeaturedIds(config.featuredSheetName) : Promise.resolve(new Set<string>()),
  ]);

  if (!res.ok) throw new Error(`Failed to fetch VGCPastes sheet: ${config.sheetName}`);

  const text = await res.text();
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  const data = JSON.parse(json) as { table: { rows: GvizRow[] } };

  return data.table.rows
    .filter((row) => cell(row, COL_ID).startsWith(config.idPrefix))
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
        regulation: config.regulation,
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

export async function getVGCPastesTeams(): Promise<Team[]> {
  const results = await Promise.all(REGULATIONS.map(fetchRegulation));
  return results.flat();
}

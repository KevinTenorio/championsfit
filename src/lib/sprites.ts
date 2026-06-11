const SHOWDOWN = "https://play.pokemonshowdown.com/sprites";

const POKEAPI = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

// Pokémon whose dex sprites don't exist on Showdown — use PokeAPI by dex number instead
const SPRITE_URL_OVERRIDES: Record<string, string> = {
  "kommo-o": `${POKEAPI}/784.png`,
  "floette-eternal": `${POKEAPI}/10061.png`,
  "floette-eternal-mega": `${POKEAPI}/10061.png`,
};

// Showdown uses abbreviated suffixes for some gender forms
const NAME_MAP: Record<string, string> = {
  "basculegion-male": "basculegion",
  "basculegion-female": "basculegion-f",
  "meowstic-male": "meowstic",
  "meowstic-female": "meowstic-f",
  "charizard-mega-y": "charizard-megay",
  "charizard-mega-x": "charizard-megax",
  "tauros-paldea-combat": "tauros-paldeacombat",
  "tauros-paldea-blaze": "tauros-paldeablaze",
  "tauros-paldea-aqua": "tauros-paldeaaqua",
};

function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9-]/g, "");
}

function showdownName(name: string): string {
  const key = normalize(name);
  return NAME_MAP[key] ?? key;
}

export function pokemonSpriteUrl(name: string): string {
  const key = normalize(name);
  return SPRITE_URL_OVERRIDES[key] ?? `${SHOWDOWN}/dex/${showdownName(name)}.png`;
}

export function pokemonFallbackUrl(name: string): string | null {
  const base = normalize(name).replace(/-mega(-[xy])?$/, "");
  if (base === normalize(name)) return null;
  return `${SHOWDOWN}/dex/${base}.png`;
}

const ITEM_URL_OVERRIDES: Record<string, { url: string; size: number }> = {
  floettite: {
    url: "https://archives.bulbagarden.net/media/upload/0/02/Bag_Floettite_CP_Sprite.png",
    size: 16,
  },
};

export function itemSpriteUrl(name: string): string {
  const key = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return ITEM_URL_OVERRIDES[key.replace(/-/g, "")]?.url ?? `${POKEAPI.replace("/pokemon", "/items")}/${key}.png`;
}

export function itemSpriteSize(name: string): number {
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return ITEM_URL_OVERRIDES[key]?.size ?? 24;
}

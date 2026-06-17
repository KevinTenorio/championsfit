// Complete Pokémon roster for Pokémon Champions — Regulation M-B
// M-B is cumulative: all M-A Pokémon remain legal.
// Mega Evolution forms are excluded: owning the base Pokémon implies the Mega form.

import { CHAMPIONS_MA } from "./champions-ma";

const MB_ADDITIONS: string[] = [
  // Gen 1
  "Vileplume",

  // Gen 2
  "Qwilfish",

  // Gen 3
  "Sceptile",
  "Blaziken",
  "Swampert",
  "Mawile",
  "Metagross",

  // Gen 4
  "Staraptor",

  // Gen 5
  "Musharna",
  "Scolipede",
  "Scrafty",
  "Eelektross",

  // Gen 6
  "Pyroar",
  "Malamar",
  "Barbaracle",
  "Dragalge",

  // Gen 8
  "Grimmsnarl",
  "Falinks",
  "Overqwil",

  // Gen 9
  "Houndstone",
  "Annihilape",
  "Gholdengo",
];

export const CHAMPIONS_MB: string[] = [...CHAMPIONS_MA, ...MB_ADDITIONS];

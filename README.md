# ChampionsFit

**Find tournament teams from the VGC community that match your Pokémon Champions roster.**

🔗 [championsfit.vercel.app](https://championsfit.vercel.app)

## What it does

ChampionsFit helps Pokémon Champions players discover real tournament teams they can already play. Mark the Pokémon you own, and the app instantly ranks thousands of community teams by how many members you already have — no team-building required.

### Features

- **Roster matching** — mark your owned Pokémon and see coverage for every team
- **Recruitment recommendations** — find out which Pokémon to target next, ranked by how many teams they'd unlock
- **Featured & Official filters** — surface curated picks and high-prestige tournament results first
- **Shiny tracking** — mark shiny Pokémon in your roster; teams with your shinies rank higher
- **Required / Banned Pokémon filters** — find teams built around specific Pokémon
- **Rental codes** — filter for teams with a rental code ready to use

All data is sourced from [VGCPastes](https://docs.google.com/spreadsheets/d/1axlwmzPA49rYkqXh7zHvAtSP-TKbM0ijGYBPRflLSWw), maintained by the VGC community. Roster is stored locally in your browser — no account needed.

## Tech stack

- [Next.js](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- Deployed on [Vercel](https://vercel.com)

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Credits

- **[VGCPastes](https://docs.google.com/spreadsheets/d/1axlwmzPA49rYkqXh7zHvAtSP-TKbM0ijGYBPRflLSWw)** — tournament team data, maintained by the VGC community
- **[PokéAPI](https://pokeapi.co)** — Pokémon sprites

## Disclaimer

Pokémon and all related names, characters, and imagery are © Nintendo / Creatures Inc. / GAME FREAK inc. ChampionsFit is a fan-made tool, not affiliated with or endorsed by Nintendo or The Pokémon Company.

## License

MIT

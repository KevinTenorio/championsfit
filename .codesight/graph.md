# Dependency Graph

## Most Imported Files (change these carefully)

- `src\components\PokemonSprite.tsx` — imported by **5** files
- `src\components\ShinyIcon.tsx` — imported by **3** files
- `src\components\TeamCard.tsx` — imported by **1** files
- `src\components\PokemonFilter.tsx` — imported by **1** files
- `src\data\champions-ma.ts` — imported by **1** files
- `src\lib\roster.ts` — imported by **1** files

## Import Map (who imports what)

- `src\components\PokemonSprite.tsx` ← `src\components\RecruitmentPageClient.tsx`, `src\components\RosterPageClient.tsx`, `src\components\TeamCard.tsx`, `src\components\TeamDetailClient.tsx`, `src\components\TeamsPageClient.tsx`
- `src\components\ShinyIcon.tsx` ← `src\components\RosterPageClient.tsx`, `src\components\TeamCard.tsx`, `src\components\TeamDetailView.tsx`
- `src\components\TeamCard.tsx` ← `src\components\TeamsPageClient.tsx`
- `src\components\PokemonFilter.tsx` ← `src\components\TeamsPageClient.tsx`
- `src\data\champions-ma.ts` ← `src\data\champions-mb.ts`
- `src\lib\roster.ts` ← `src\lib\recruitment.ts`

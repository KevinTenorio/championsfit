# Backlog — Champions Team Builder

## MVP

1. Web app responsivo (Next.js + Tailwind, deploy na Vercel)
2. Usuário monta roster manualmente (marca quais Pokémon possui — presença binária)
3. Dados de Pokémon (stats, tipos, moves, abilities) via PokéAPI
4. App busca times reais de torneios via API do Limitless VGC
5. Filtro por Regulation (MA, MB, etc.) — seletor sempre visível, padrão = regulation ativo
6. Filtro por Pokémon obrigatórios (times que incluem X)
7. Filtro por Pokémon banidos (times que excluem X)
8. Filtro por cobertura do roster — threshold configurável (opcional: usuário pode explorar sem roster)
9. Times exibidos ordenados por % de cobertura do roster
10. Roster salvo em localStorage (sem necessidade de conta)

## Fora do MVP (roadmap)

- **Página de usage / tier list** — listagem de todos os Pokémon do regulation ordenados por usage %, com duas fontes selecionáveis: torneios (Limitless VGC) e ladder (Smogon/Showdown, atualizado mensalmente); Pokémon agrupados em tiers derivados automaticamente dos dados de usage; quando o usuário tiver roster configurado, destacar quais Pokémon de cada tier ele já possui
- **Times favoritados** — usuário salva times de interesse para consultar depois
- **Backend com banco de dados e job de ingestão** — persistir times de múltiplas fontes para eliminar dependência de rate limits. Fontes: Limitless VGC (API, torneios comunitários) + VGCPastes Google Sheet (torneios oficiais: Regionals, Internationals, Worlds) + scraping do limitlessvgc.com (circuito oficial completo). Sheet do VGCPastes acessível em `docs.google.com/spreadsheets/d/1axlwmzPA49rYkqXh7zHvAtSP-TKbM0ijGYBPRflLSWw` via endpoint público `gviz/tq` sem autenticação — contém Pokémon nomeados por time, event, rank e links de pokepaste com builds completos.
- **Login / sync entre dispositivos** — roster salvo em conta, sincronizado via Google/Nintendo Account
- **Import automático de roster via Nintendo Account** — precedente existe no app de TCG Pocket
- **Geração de times novos por preferência** — dado o roster do usuário, gerar um time otimizado por estilo de jogo (agressivo, controle, etc.)
- **Damage calculator**
- **Análise de cobertura de tipos**
- **Import de roster por foto** — usuário tira screenshot da tela de roster e o app reconhece os Pokémon via OCR/visão computacional
- **Sugestão de recrutamento (Roster Ranch)** — "recrute X para desbloquear N times adicionais"
- **Internacionalização (i18n)** — suporte a múltiplos idiomas na UI (português como primeira adição após inglês); manter inglês como idioma padrão
- **Assistente de pick no Roster Ranch** — usuário informa as 10 opções do seu recruit atual (digitando ou por foto) e o app sugere o melhor pick dado o roster e os times disponíveis
- **Sprite shiny** — quando um Pokémon está marcado como shiny (no Roster e nos membros de times que o usuário possui shiny), exibir a versão shiny da imagem em vez do sprite normal. Inicialmente shiny é indicado apenas por uma representação visual diferente (ícone/badge); a troca do sprite fica para depois.
## Monetização (futuro)

- **Freemium** — features básicas grátis; features avançadas do roadmap (geração de times, sugestão de recrutamento, sync) como paywall natural
- **Doação** — Ko-fi ou similar, voluntário, sem paywall

## Custos de infra estimados

| Fase | Custo mensal |
|---|---|
| MVP (só frontend + APIs públicas) | R$0 (Vercel free tier) |
| Com login/backend (até ~50k usuários ativos) | R$0 (Supabase free tier) |
| Escala real (100k+ usuários) | ~US$45/mês (Vercel Pro + Supabase Pro) |

Domínio custom: ~R$50/ano (opcional).

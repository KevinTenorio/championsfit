# Context — Champions Team Builder

## Glossário

### Roster
Conjunto de Pokémon que um usuário possui no jogo. Formado por recrutamento via Roster Ranch e por transferência de outros jogos da franquia. Representado no sistema como um conjunto de nomes canônicos de Pokémon (presença binária — tem ou não tem). O Roster é a fonte de verdade para nomenclatura de Pokémon no sistema.

### Time
Conjunto de 6 Pokémon (com itens) selecionados para competição. Originado de torneios reais ou da ladder, obtido via VGCPastes. Todo Time pertence a um Regulation e a um torneio/evento.

### Cobertura
Percentual de Pokémon de um Time que estão presentes no Roster do usuário. Ex: cobertura de 5/6 = 83%. Usado para ordenar e filtrar recomendações.

### Threshold
Valor mínimo de Cobertura configurado pelo usuário para filtrar Times exibidos. Ex: threshold de 4/6 exibe apenas times dos quais o usuário possui ao menos 4 Pokémon.

### Roster Ranch
Mecânica de recrutamento do jogo. O usuário gasta recursos para recrutar um novo Pokémon ao Roster, escolhendo entre 10 opções aleatórias apresentadas por rodada.

### Regulation
Conjunto de regras, Pokémon e itens disponíveis para uso competitivo em um determinado período. Identificado por código (ex: M-A, M-B). Muda aproximadamente a cada 2 meses. Todo Time está associado a um Regulation.

### VGCPastes
Planilha Google Sheets mantida pela comunidade. Fonte primária de dados de Times para o sistema. Acessada via endpoint gviz sem necessidade de autenticação.

### Nome canônico
Nome de um Pokémon conforme definido no Roster do sistema (arquivo `champions-ma.ts`). É a forma de referência usada em todo o app. Nomes vindos de fontes externas (VGCPastes) são normalizados para o nome canônico antes de qualquer comparação. Ex: "Basculegion" do VGCPastes → "Basculegion-Male" canônico.

### Forma regional
Variante de um Pokémon associada a uma região específica do jogo (ex: Raichu-Alola, Ninetales-Galar). Tratada como um Pokémon distinto no Roster — possuir a forma base não implica possuir a forma regional.

### Forma estética
Variante de um Pokémon sem diferença mecânica — mesmos stats, tipos, moves e habilidades; apenas aparência distinta. Exemplos: Maushold-Four e Sinistcha-Masterpiece. Tratada como o mesmo Pokémon no Roster: existe uma única entrada (o nome base), e qualquer time com a forma estética equivale a um time com o Pokémon base. Variantes nunca coexistem no mesmo time.

### Mega Evolution
Transformação temporária durante a batalha ativada por um Mega Stone. Um Pokémon e sua Mega Evolution compartilham o mesmo slot no Roster — possuir o Pokémon base implica possuir a Mega Evolution. Mega Evolutions não aparecem como entradas separadas no Roster.

### Time Featured
Time curado manualmente pela comunidade e destacado na aba "Featured" do VGCPastes. Sinal de curadoria deliberada — por isso pesa mais que Torneio Oficial na ordenação. Recebe badge azul. Independente de Torneio Oficial: um Time pode carregar os dois selos ao mesmo tempo, exibindo ambos os badges. A informação é carregada dinamicamente da aba "Champions M-A Featured Teams" da planilha.

### Torneio Oficial
Torneio de alto prestígio reconhecido como evento oficial da temporada competitiva (ex: Special Event, Regional Championships). Times desses torneios recebem badge próprio e prioridade na ordenação em caso de empate — abaixo de Time Featured, pois o selo Oficial atesta o prestígio do evento, não uma curadoria do time em si. A lista de torneios oficiais é mantida estaticamente no sistema (`official-tournaments.ts`).

### Pokepaste
Representação textual de um Time no formato Showdown, hospedada em pokepast.es. Contém o Build completo de cada membro: ability, nature, EVs e moves. Acessada via endpoint público `{url}/json`. Fonte secundária de dados — complementa o VGCPastes, que fornece apenas nome e item de cada membro.

### Build
Conjunto de atributos de batalha de um membro de um Time: ability, nature, EVs e moves. Disponível apenas quando o Time possui um Pokepaste associado. EVs são relevantes no Pokémon Champions e exibidos na interface; IVs são irrelevantes e ignorados.

### Forma de gênero
Variante de um Pokémon diferenciada por gênero, com sprites distintos (ex: Meowstic-Male, Meowstic-Female, Basculegion-Male, Basculegion-Female). Tratada como entradas separadas no Roster. VGCPastes usa convenção diferente (ex: "Basculegion" para macho, "Basculegion-F" para fêmea), normalizada para o nome canônico.

### Recruitment Priority
Ordenação dos Pokémon que o usuário ainda **não** possui segundo o quanto recrutar cada um o aproximaria de montar Times que ele valoriza. Completar um Time (deixá-lo 6/6, jogável) tem prioridade absoluta sobre apenas aproximá-lo de completo. Entre Times, os marcados como Time Featured e aqueles em que o usuário já possui membros Shiny pesam mais; Torneios Oficiais não recebem peso extra por si só nesta feature. Exibida na aba "Recruitment" ao lado da Popularity, e o usuário escolhe por qual ordenar. Com o Roster vazio, a Recruitment Priority recai sobre a Popularity. Distinta de Roster Ranch, que é apenas a mecânica de recrutamento do jogo, não esta recomendação.

### Popularity
Contagem crua de em quantos Times de um Regulation cada Pokémon aparece, sem qualquer ponderação por Cobertura, prestígio ou Shiny. É o sinal neutro do metagame, exibido na aba "Recruitment" como contraponto à Recruitment Priority.

### Shiny
Marca aplicada a uma entrada do Roster indicando que o usuário possui a variante shiny daquele Pokémon. Ser shiny implica possuir o Pokémon — não existe shiny de algo fora do Roster, e desmarcar a posse remove a marca de shiny. A marca é por nome canônico; formas regionais e de gênero (entradas separadas) têm shiny independente, e o shiny da base de uma Mega Evolution vale para a Mega, pois compartilham slot. Shiny não altera a Cobertura — um membro shiny já é um membro possuído —, servindo apenas como critério de desempate na ordenação de Times: entre Times de mesma Cobertura, o que possui mais membros shiny aparece primeiro, antes do desempate por Time Featured e Torneio Oficial.

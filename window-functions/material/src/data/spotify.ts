// Banco "spotify": o mesmo usado na aula.

export type Musica = { id: string; usuario: 'Ana' | 'Bruno'; musica: string; plays: number }

export const MAIS_OUVIDAS: Musica[] = [
  { id: 'tempo-perdido', usuario: 'Bruno', musica: 'Tempo Perdido', plays: 61 },
  { id: 'swim', usuario: 'Ana', musica: 'Swim', plays: 87 },
  { id: 'jetski', usuario: 'Bruno', musica: 'Jetski', plays: 140 },
  { id: 'anunciacao', usuario: 'Ana', musica: 'Anunciação', plays: 45 },
  { id: 'ophelia', usuario: 'Ana', musica: 'The Fate of Ophelia', plays: 132 },
  { id: 'eu-te-seguro', usuario: 'Bruno', musica: 'Eu Te Seguro', plays: 33 },
  { id: 'p-do-pecado', usuario: 'Ana', musica: 'P do Pecado', plays: 87 },
  { id: 'talvez', usuario: 'Bruno', musica: 'Talvez Você Precise de Mim', plays: 92 },
  { id: 'evidencias', usuario: 'Ana', musica: 'Evidências', plays: 98 },
  { id: 'quem-e-esse', usuario: 'Bruno', musica: 'Quem É Esse?', plays: 110 },
]

export const ARTISTAS: Record<string, string> = {
  'The Fate of Ophelia': 'Taylor Swift',
  Evidências: 'Chitãozinho & Xororó',
  Swim: 'BTS',
  'P do Pecado': 'Menos É Mais e Simone Mendes',
  Anunciação: 'Alceu Valença',
  Jetski: 'Pedro Sampaio, MC Meno K e Melody',
  'Quem É Esse?': 'Julliany Souza',
  'Talvez Você Precise de Mim': 'Veigh',
  'Tempo Perdido': 'Legião Urbana',
  'Eu Te Seguro': 'Panda',
}

export type Acesso = { id: string; usuario: 'Ana' | 'Bruno'; data_acesso: string; minutos: number }

export const ACESSOS: Acesso[] = [
  ['Ana', '2026-11-01', 42], ['Ana', '2026-11-02', 35], ['Ana', '2026-11-03', 58], ['Ana', '2026-11-05', 20],
  ['Ana', '2026-11-06', 64], ['Ana', '2026-11-12', 31], ['Bruno', '2026-11-01', 90], ['Bruno', '2026-11-08', 15],
  ['Bruno', '2026-11-09', 47], ['Bruno', '2026-11-10', 120], ['Bruno', '2026-11-20', 38],
].map(([usuario, data_acesso, minutos]) => ({
  id: `${usuario}-${data_acesso}`,
  usuario: usuario as 'Ana' | 'Bruno',
  data_acesso: data_acesso as string,
  minutos: minutos as number,
}))

export const ASSINATURAS: [string, string, number][] = [
  ['2026-07', 'Individual', 1200], ['2026-08', 'Individual', 1350], ['2026-09', 'Individual', 1280], ['2026-10', 'Individual', 1500],
  ['2026-07', 'Universitário', 400], ['2026-08', 'Universitário', 950], ['2026-09', 'Universitário', 700], ['2026-10', 'Universitário', 720],
]

const q = (s: string) => `'${s.replace(/'/g, "''")}'`

/** Script que cria o banco. Roda igual no MySQL 8 e no SQLite do site. */
export const SPOTIFY_SQL = `CREATE TABLE mais_ouvidas (
  usuario VARCHAR(20),
  musica  VARCHAR(60),
  plays   INT
);
INSERT INTO mais_ouvidas (usuario, musica, plays) VALUES
${MAIS_OUVIDAS.map((m) => `  (${q(m.usuario)}, ${q(m.musica)}, ${m.plays})`).join(',\n')};

CREATE TABLE acessos (
  usuario     VARCHAR(20),
  data_acesso DATE,
  minutos     INT
);
INSERT INTO acessos (usuario, data_acesso, minutos) VALUES
${ACESSOS.map((a) => `  (${q(a.usuario)}, ${q(a.data_acesso)}, ${a.minutos})`).join(',\n')};

CREATE TABLE assinaturas (
  mes               CHAR(7),
  plano             VARCHAR(20),
  novas_assinaturas INT
);
INSERT INTO assinaturas (mes, plano, novas_assinaturas) VALUES
${ASSINATURAS.map(([m, p, n]) => `  (${q(m)}, ${q(p)}, ${n})`).join(',\n')};
`

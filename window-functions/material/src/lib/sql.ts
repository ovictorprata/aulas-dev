// Banco de dados no navegador (SQLite compilado para JavaScript).
// As window functions funcionam igual ao MySQL 8.
import initSqlJs from 'sql.js/dist/sql-asm.js'
import type { Database, SqlJsStatic } from 'sql.js'
import { SPOTIFY_SQL } from '../data/spotify'
import { LOJA_SQL } from '../data/loja'

export type Banco = 'spotify' | 'loja'
export type Resultado = { columns: string[]; values: (string | number | null)[][] }

const SCRIPTS: Record<Banco, string> = { spotify: SPOTIFY_SQL, loja: LOJA_SQL }

let sqlPromise: Promise<SqlJsStatic> | null = null
const getSql = () => (sqlPromise ??= initSqlJs())

/** No SQLite, DECIMAL vira inteiro quando não há centavos; REAL mantém a divisão com casas decimais, como no MySQL. */
const paraSqlite = (script: string) => script.replace(/DECIMAL\(\d+,\s*\d+\)/g, 'REAL')

/** Cada consulta roda num banco novo: nada que o aluno faça estraga os dados. */
async function novoBanco(banco: Banco): Promise<Database> {
  const SQL = await getSql()
  const db = new SQL.Database()
  db.run(paraSqlite(SCRIPTS[banco]))
  return db
}

/** MySQL aceita funções que o SQLite não tem; aqui ficam as mais comuns. */
function compatibilidade(sql: string) {
  return sql.replace(/\bNOW\(\)/gi, "datetime('now')")
}

export async function executar(banco: Banco, sql: string): Promise<Resultado> {
  const db = await novoBanco(banco)
  try {
    const res = db.exec(compatibilidade(sql))
    const last = res[res.length - 1]
    return last ? { columns: last.columns, values: last.values as Resultado['values'] } : { columns: [], values: [] }
  } finally {
    db.close()
  }
}

/** Traduz os erros mais comuns do SQLite para português. */
export function explicarErro(msg: string): string {
  if (/no such column: (\S+)/i.test(msg)) {
    const col = msg.match(/no such column: (\S+)/i)![1]
    return `A coluna "${col}" não existe aqui. Confira o nome, ou se ela foi criada no SELECT e você tentou usá-la no WHERE.`
  }
  if (/no such table: (\S+)/i.test(msg)) return `A tabela "${msg.match(/no such table: (\S+)/i)![1]}" não existe neste banco.`
  if (/misuse of window function/i.test(msg)) return 'Window function não pode ir no WHERE: calcule dentro de um WITH e filtre fora dele.'
  if (/syntax error/i.test(msg)) return 'Erro de sintaxe perto de: ' + (msg.match(/near "([^"]*)"/)?.[1] ?? '?') + '. Confira vírgulas e parênteses.'
  if (/incomplete input/i.test(msg)) return 'A consulta terminou antes da hora: falta fechar algum parêntese?'
  return msg
}

// ---------- correção automática ----------

const norm = (v: unknown) => {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'number') return (Math.round(v * 100) / 100).toFixed(2)
  const n = Number(v)
  if (String(v).trim() !== '' && !Number.isNaN(n)) return (Math.round(n * 100) / 100).toFixed(2)
  return String(v).trim().toLowerCase()
}
const key = (arr: string[]) => arr.slice().sort().join('|')

export type Correcao = { ok: boolean; mensagem: string }

/**
 * Compara o resultado do aluno com o da solução sem exigir os mesmos nomes de coluna,
 * a mesma ordem de colunas nem a mesma ordem de linhas. Colunas a mais são aceitas.
 */
export function corrigir(aluno: Resultado, esperado: Resultado): Correcao {
  if (aluno.values.length !== esperado.values.length)
    return { ok: false, mensagem: `Sua consulta trouxe ${aluno.values.length} linhas; o esperado são ${esperado.values.length}.` }

  const colAluno = aluno.columns.map((_, i) => aluno.values.map((r) => norm(r[i])))
  const colEsp = esperado.columns.map((_, i) => esperado.values.map((r) => norm(r[i])))
  const usadas = new Set<number>()
  const mapa: number[] = []
  for (let j = 0; j < colEsp.length; j++) {
    const alvo = key(colEsp[j])
    const i = colAluno.findIndex((c, idx) => !usadas.has(idx) && key(c) === alvo)
    if (i < 0) return { ok: false, mensagem: `Falta uma coluna com os valores de "${esperado.columns[j]}", ou os valores dela não batem.` }
    usadas.add(i)
    mapa.push(i)
  }
  const linhasAluno = aluno.values.map((r) => mapa.map((i) => norm(r[i])).join('¦')).sort()
  const linhasEsp = esperado.values.map((r) => r.map(norm).join('¦')).sort()
  const ok = linhasAluno.every((l, i) => l === linhasEsp[i])
  return ok
    ? { ok: true, mensagem: 'Certo! O resultado bate com o esperado.' }
    : { ok: false, mensagem: 'As colunas existem, mas os valores não estão nas linhas certas. Confira o PARTITION BY e o ORDER BY da janela.' }
}

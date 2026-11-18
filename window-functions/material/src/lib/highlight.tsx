import type { ReactNode } from 'react'

const KEYWORDS = new Set(
  'SELECT FROM WHERE ORDER BY GROUP PARTITION OVER AS WITH JOIN ON DESC ASC AND OR NOT NULL LIMIT HAVING CREATE TABLE INSERT INTO VALUES INT VARCHAR DATE CHAR DECIMAL PRIMARY KEY ROWS RANGE BETWEEN PRECEDING FOLLOWING CURRENT ROW UNBOUNDED DISTINCT IS IN LEFT INNER CASE WHEN THEN ELSE END'.split(' '),
)
const FUNCTIONS = new Set('ROW_NUMBER RANK DENSE_RANK NTILE LAG LEAD SUM AVG COUNT MIN MAX ROUND FIRST_VALUE LAST_VALUE DATEDIFF'.split(' '))

const TOKEN = /(--[^\n]*)|('(?:[^']|'')*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/g

/** Colore SQL com as mesmas cores dos slides: palavra-chave em lilás, função em verde. */
export function highlight(sql: string): ReactNode[] {
  const out: ReactNode[] = []
  let m: RegExpExecArray | null
  let i = 0
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(sql))) {
    const [t, com, str, num, word] = m
    const k = i++
    if (com) out.push(<span key={k} className="tk-c">{t}</span>)
    else if (str) out.push(<span key={k} className="tk-s">{t}</span>)
    else if (num) out.push(<span key={k} className="tk-n">{t}</span>)
    else if (word && FUNCTIONS.has(word.toUpperCase())) out.push(<span key={k} className="tk-f">{t}</span>)
    else if (word && KEYWORDS.has(word.toUpperCase())) out.push(<span key={k} className="tk-k">{t}</span>)
    else out.push(t)
  }
  return out
}

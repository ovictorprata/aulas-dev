import type { Resultado } from '../../lib/sql'

const fmt = (v: string | number | null) => (v === null ? 'NULL' : typeof v === 'number' && !Number.isInteger(v) ? v.toFixed(2) : String(v))

type Props = { r: Resultado; /** Esconde a contagem de linhas. */ semContagem?: boolean; /** Coluna em destaque (a calculada pela window function). */ destaque?: string }

/** Mostra o resultado de uma consulta. A largura de cada coluna acompanha o maior valor. */
export function ResultTable({ r, semContagem, destaque }: Props) {
  if (!r.columns.length) return <p className="result-meta">A consulta rodou, mas não devolveu linhas.</p>
  const widths = r.columns.map((c, i) => {
    const longest = Math.max(c.length, ...r.values.map((row) => fmt(row[i]).length))
    return Math.min(360, longest * 9 + 28)
  })
  const grid = widths.map((w) => `${w}px`).join(' ')
  const isNum = r.columns.map((_, i) => r.values.every((row) => row[i] === null || typeof row[i] === 'number'))
  return (
    <>
      {!semContagem && <p className="result-meta">{r.values.length} linha{r.values.length === 1 ? '' : 's'}</p>}
      <div className="table-wrap" role="table" aria-label="Resultado da consulta">
        <div className="dt">
          <div className="dt-row head" role="row" style={{ gridTemplateColumns: grid }}>
            {r.columns.map((c, i) => (
              <div key={i} role="columnheader" className={`dt-cell ${isNum[i] ? 'num' : ''} ${c === destaque ? 'hd' : ''}`}>{c}</div>
            ))}
          </div>
          {r.values.map((row, j) => (
            <div key={j} className="dt-row" role="row" style={{ gridTemplateColumns: grid }}>
              {row.map((v, i) => (
                <div key={i} role="cell" className={`dt-cell ${isNum[i] ? 'num' : ''} ${v === null ? 'muted' : r.columns[i] === destaque ? 'pos' : ''}`}>{fmt(v)}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

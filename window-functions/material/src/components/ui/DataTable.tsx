import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

export type Column = { key: string; label: string; width: number; kind?: 'num' | 'pos' }
export type Row = {
  id: string
  cells: Record<string, ReactNode>
  /** a = Ana/grupo 1, b = Bruno/grupo 2, hot = destaque, dim = apagada */
  tone?: 'a' | 'b' | 'hot' | 'dim'
  /** Colunas que piscam em verde neste passo. */
  flash?: string[]
  /** Classe por célula, como "neg" para número negativo. */
  cellTone?: Record<string, string>
}

type Props = { columns: Column[]; rows: Row[]; caption?: string }

/** Tabela em grade: quando as linhas mudam de ordem, elas deslizam até o novo lugar. */
export function DataTable({ columns, rows, caption }: Props) {
  const grid = columns.map((c) => `${c.width}px`).join(' ')
  return (
    <div className="table-wrap" role="table" aria-label={caption}>
      <div className="dt">
        <div className="dt-row head" role="row" style={{ gridTemplateColumns: grid }}>
          {columns.map((c) => (
            <div key={c.key} role="columnheader" className={`dt-cell ${c.kind === 'num' || c.kind === 'pos' ? 'num' : ''}`}>
              {c.label}
            </div>
          ))}
        </div>
        <AnimatePresence initial={false}>
          {rows.map((r) => (
            <motion.div
              key={r.id}
              layout
              role="row"
              initial={{ opacity: 0 }}
              animate={{ opacity: r.tone === 'dim' ? 0.35 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className={`dt-row ${r.tone && r.tone !== 'dim' ? r.tone : ''}`}
              style={{ gridTemplateColumns: grid }}
            >
              {columns.map((c) => {
                const v = r.cells[c.key]
                const flash = r.flash?.includes(c.key)
                const tone = r.cellTone?.[c.key] ?? (c.kind ?? '')
                return (
                  <div key={c.key} role="cell" className={`dt-cell ${tone} ${flash ? 'flash' : ''}`}>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={String(v ?? '')}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                        style={{ display: 'inline-block' }}
                      >
                        {v ?? ' '}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                )
              })}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { agrupadas, tom } from '../../lib/spotify'
import { Code } from '../ui/Code'
import { DataTable } from '../ui/DataTable'
import { Segmented } from '../ui/Segmented'

type Fn = 'SUM' | 'AVG' | 'MAX' | 'COUNT'
const NOME: Record<Fn, string> = { SUM: 'total', AVG: 'media', MAX: 'maior', COUNT: 'qtd' }
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ','))

/** Troque a conta do grupo e, se quiser, compare cada linha com ela. */
export function AggDemo() {
  const [fn, setFn] = useState<Fn>('SUM')
  const [dif, setDif] = useState<'valor' | 'dif'>('valor')
  const lista = agrupadas()

  const conta = (u: string) => {
    const p = lista.filter((m) => m.usuario === u).map((m) => m.plays)
    if (fn === 'SUM') return p.reduce((a, b) => a + b, 0)
    if (fn === 'AVG') return p.reduce((a, b) => a + b, 0) / p.length
    if (fn === 'MAX') return Math.max(...p)
    return p.length
  }
  const col = dif === 'valor' ? NOME[fn] : 'diferenca'
  const expr = `${fn}(${fn === 'COUNT' ? '*' : 'plays'}) OVER (PARTITION BY usuario)`

  return (
    <div className="card" style={{ gap: 16 }}>
      <div className="controls">
        <Segmented label="Conta" value={fn} onChange={setFn} options={(['SUM', 'AVG', 'MAX', 'COUNT'] as Fn[]).map((f) => ({ value: f, label: f }))} />
        <Segmented
          label="Mostrar"
          value={dif}
          onChange={setDif}
          options={[
            { value: 'valor', label: 'a conta' },
            { value: 'dif', label: 'plays − conta' },
          ]}
        />
      </div>
      <Code
        parts={[
          { text: 'SELECT usuario, musica, plays,\n       ' },
          { text: dif === 'dif' ? `plays - ${expr}` : expr, mark: true },
          { text: ` AS ${col}\nFROM mais_ouvidas;` },
        ]}
      />
      <DataTable
        caption="Conta do grupo"
        columns={[
          { key: 'usuario', label: 'usuario', width: 90 },
          { key: 'musica', label: 'musica', width: 250 },
          { key: 'plays', label: 'plays', width: 70, kind: 'num' },
          { key: 'v', label: col, width: 110, kind: 'pos' },
        ]}
        rows={lista.map((m) => {
          const v = dif === 'valor' ? conta(m.usuario) : m.plays - conta(m.usuario)
          return {
            id: m.id,
            tone: tom(m.usuario),
            cells: { usuario: m.usuario, musica: m.musica, plays: m.plays, v: dif === 'dif' && v > 0 ? `+${fmt(v)}` : fmt(v).replace('-', '−') },
            cellTone: dif === 'dif' && v < 0 ? { v: 'neg' } : undefined,
          }
        })}
      />
      <p className="step-text">
        {dif === 'valor' ? (
          <>Sem ORDER BY na janela, a conta usa <b>o pedaço inteiro</b> e repete o resultado em todas as linhas dele.</>
        ) : (
          <>Com a conta do grupo na mesma linha, comparar fica fácil: <b>positivo</b> está acima, <b>negativo</b> está abaixo.</>
        )}
      </p>
    </div>
  )
}

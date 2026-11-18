import { useState } from 'react'
import { Segmented } from '../ui/Segmented'
import { Code } from '../ui/Code'
import { DataTable, type Row } from '../ui/DataTable'
import { agrupadas, tom } from '../../lib/spotify'

const TOTAL = { Ana: 449, Bruno: 436 }

/** Mesma pergunta, duas respostas: o GROUP BY junta as linhas; o OVER mantém todas. */
export function GroupVsOver() {
  const [modo, setModo] = useState<'group' | 'over'>('group')
  const rows: Row[] =
    modo === 'group'
      ? (['Ana', 'Bruno'] as const).map((u) => ({ id: `g-${u}`, tone: tom(u), cells: { usuario: u, musica: '', plays: '', total: TOTAL[u] } }))
      : agrupadas().map((m) => ({ id: m.id, tone: tom(m.usuario), cells: { usuario: m.usuario, musica: m.musica, plays: m.plays, total: TOTAL[m.usuario] } }))

  return (
    <div className="card" style={{ gap: 16 }}>
      <Segmented
        label="Modo"
        value={modo}
        onChange={setModo}
        options={[
          { value: 'group', label: 'Com GROUP BY' },
          { value: 'over', label: 'Com OVER' },
        ]}
      />
      <Code
        sql={
          modo === 'group'
            ? 'SELECT usuario, SUM(plays) AS total\nFROM mais_ouvidas\nGROUP BY usuario;'
            : 'SELECT usuario, musica, plays,\n       SUM(plays) OVER (PARTITION BY usuario) AS total\nFROM mais_ouvidas;'
        }
      />
      <DataTable
        caption="Resultado"
        columns={[
          { key: 'usuario', label: 'usuario', width: 100 },
          { key: 'musica', label: 'musica', width: 250 },
          { key: 'plays', label: 'plays', width: 70, kind: 'num' },
          { key: 'total', label: 'total', width: 80, kind: 'pos' },
        ]}
        rows={rows}
      />
      <p className="step-text">
        {modo === 'group' ? (
          <>O GROUP BY <b>junta</b> as músicas de cada pessoa numa linha só. Sobram 2 linhas: o total aparece, mas as músicas somem.</>
        ) : (
          <>Com OVER, <b>as 10 linhas continuam</b> e cada uma ganha uma coluna com o total da sua pessoa. É isso que uma window function faz.</>
        )}
      </p>
    </div>
  )
}

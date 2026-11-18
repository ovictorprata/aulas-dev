import { useState } from 'react'
import { numerar, ordenadas, type Funcao } from '../../lib/spotify'
import { Code } from '../ui/Code'
import { DataTable } from '../ui/DataTable'
import { Segmented } from '../ui/Segmented'

const EXPLICA: Record<Funcao, string> = {
  ROW_NUMBER: 'Não aceita empate: cada linha recebe um número diferente. Swim e P do Pecado têm 87 plays, mas uma fica em 6º e a outra em 7º, escolhida sem critério.',
  RANK: 'Empatou, divide a posição e pula a seguinte, como no pódio olímpico: Swim e P do Pecado ficam em 6º e o Tempo Perdido vai direto para 8º.',
  DENSE_RANK: 'Empatou, divide a posição e não pula nenhuma: Swim e P do Pecado ficam em 6º e o Tempo Perdido fica em 7º.',
}

/** Troque só a função e veja a coluna de posição mudar nas linhas destacadas. */
export function TieDemo() {
  const [fn, setFn] = useState<Funcao>('ROW_NUMBER')
  const ord = ordenadas()
  const pos = numerar(ord, fn)
  return (
    <div className="card" style={{ gap: 16 }}>
      <Segmented
        label="Função"
        value={fn}
        onChange={setFn}
        options={(['ROW_NUMBER', 'RANK', 'DENSE_RANK'] as Funcao[]).map((f) => ({ value: f, label: f }))}
      />
      <Code
        parts={[
          { text: 'SELECT usuario, musica, plays,\n       ' },
          { text: `${fn}()`, mark: true },
          { text: ' OVER (ORDER BY plays DESC) AS posicao\nFROM mais_ouvidas;' },
        ]}
      />
      <DataTable
        caption="Ranking com empate"
        columns={[
          { key: 'musica', label: 'musica', width: 250 },
          { key: 'plays', label: 'plays', width: 70, kind: 'num' },
          { key: 'posicao', label: 'posicao', width: 80, kind: 'pos' },
        ]}
        rows={ord.map((m, i) => ({
          id: m.id,
          cells: { musica: m.musica, plays: m.plays, posicao: pos[i] },
          tone: m.plays === 87 || m.plays === 61 ? 'hot' : undefined,
        }))}
      />
      <p className="step-text">{EXPLICA[fn]}</p>
    </div>
  )
}

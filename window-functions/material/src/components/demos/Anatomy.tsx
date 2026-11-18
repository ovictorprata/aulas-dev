import { useState } from 'react'

type Parte = { id: string; texto: string; cls: 'fn' | 'kw'; titulo: string; desc: string }

const PARTES: Record<string, Parte> = {
  fn: { id: 'fn', texto: 'ROW_NUMBER()', cls: 'fn', titulo: 'A função: qual conta?', desc: 'O que calcular em cada linha. Aqui, numerar. Outras opções: RANK, DENSE_RANK, SUM, AVG, LAG…' },
  over: { id: 'over', texto: 'OVER (', cls: 'kw', titulo: 'OVER: aqui começa a janela', desc: 'Tudo dentro dos parênteses do OVER descreve como a tabela deve ser enxergada enquanto a conta é feita.' },
  part: { id: 'part', texto: 'PARTITION BY usuario', cls: 'kw', titulo: 'Em quais grupos?', desc: 'Divide a tabela em pedaços, e a conta recomeça em cada um. É opcional: sem ele, a tabela inteira é um grupo só. Ele aparece na parte 04.' },
  ord: { id: 'ord', texto: 'ORDER BY plays DESC', cls: 'kw', titulo: 'Em qual ordem?', desc: 'Ordena as linhas antes da conta. Rankings e LAG precisam dele; SUM e AVG do grupo inteiro, não.' },
  fim: { id: 'fim', texto: ')', cls: 'kw', titulo: 'Fim da janela', desc: 'Depois do parêntese vem o AS, que dá nome à nova coluna.' },
}

/** Cada linha do código, já quebrada do jeito que se escreve no dia a dia. */
const LINHAS: { ids: string[]; recuo?: boolean }[] = [{ ids: ['fn', 'over'] }, { ids: ['part'], recuo: true }, { ids: ['ord'], recuo: true }, { ids: ['fim'] }]

/** Toque em cada parte da linha para ver o que ela faz. */
export function Anatomy() {
  const [ativo, setAtivo] = useState('fn')
  const p = PARTES[ativo]
  return (
    <div className="card" style={{ gap: 16 }}>
      <div className="anatomy" role="tablist" aria-label="Partes de uma window function">
        {LINHAS.map((l, i) => (
          <div key={i} className={`anatomy-line ${l.recuo ? 'in' : ''}`}>
            {l.ids.map((id) => {
              const x = PARTES[id]
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={ativo === id}
                  className={`part ${x.cls} ${ativo === id ? 'on' : ''}`}
                  onClick={() => setAtivo(id)}
                  onMouseEnter={() => setAtivo(id)}
                >
                  {x.texto}
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <div role="tabpanel">
        <h3 style={{ marginBottom: 6 }}>{p.titulo}</h3>
        <p style={{ color: 'var(--text-2)' }}>{p.desc}</p>
      </div>
    </div>
  )
}

import { useState } from 'react'

const PARTES = [
  { id: 'fn', texto: 'RANK()', cls: 'fn', titulo: 'A função: qual conta?', desc: 'O que você quer calcular: numerar (ROW_NUMBER, RANK, DENSE_RANK), somar (SUM), tirar a média (AVG), pegar a linha de cima (LAG)…' },
  { id: 'over', texto: 'OVER (', cls: 'kw', titulo: 'OVER: aqui começa a janela', desc: 'Tudo dentro dos parênteses do OVER descreve como a tabela deve ser enxergada enquanto a conta é feita.' },
  { id: 'part', texto: 'PARTITION BY usuario', cls: 'kw', titulo: 'Em quais grupos?', desc: 'Divide a tabela em pedaços, e a conta recomeça em cada um. Opcional: sem ele, a tabela inteira é um grupo só.' },
  { id: 'ord', texto: 'ORDER BY plays DESC', cls: 'kw', titulo: 'Em qual ordem?', desc: 'Ordena as linhas dentro de cada pedaço antes da conta. Rankings e LAG precisam dele; SUM e AVG do grupo inteiro, não.' },
  { id: 'fim', texto: ')', cls: 'kw', titulo: 'Fim da janela', desc: 'Depois do parêntese vem o AS, que dá nome à nova coluna.' },
]

/** Toque em cada parte da linha para ver o que ela faz. */
export function Anatomy() {
  const [ativo, setAtivo] = useState('fn')
  const p = PARTES.find((x) => x.id === ativo)!
  return (
    <div className="card" style={{ gap: 16 }}>
      <div className="anatomy" role="tablist" aria-label="Partes de uma window function">
        {PARTES.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={ativo === x.id}
            className={`part ${x.cls} ${ativo === x.id ? 'on' : ''}`}
            onClick={() => setAtivo(x.id)}
            onMouseEnter={() => setAtivo(x.id)}
          >
            {x.texto}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        <h3 style={{ marginBottom: 6 }}>{p.titulo}</h3>
        <p style={{ color: 'var(--text-2)' }}>{p.desc}</p>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { SqlEditor } from './SqlEditor'
import { ResultTable } from './ResultTable'
import { useQuery } from './useQuery'
import { Code } from '../ui/Code'
import { corrigir, executar, type Correcao } from '../../lib/sql'
import type { Exercicio } from '../../data/exercicios'

type Props = { ex: Exercicio; numero: number; feito: boolean; onFeito: () => void }

const INICIAL = '-- escreva sua consulta aqui\n'

/** Um exercício da lista: escreve, roda, confere com a solução sem precisar do mesmo nome de coluna. */
export function ExerciseCard({ ex, numero, feito, onFeito }: Props) {
  const [sql, setSql] = useState(INICIAL)
  const [correcao, setCorrecao] = useState<Correcao | null>(null)
  const q = useQuery('loja')

  async function conferir() {
    setCorrecao(null)
    const aluno = await q.rodar(sql)
    if (!aluno) return
    const esperado = await executar('loja', ex.solucao)
    const c = corrigir(aluno, esperado)
    setCorrecao(c)
    if (c.ok) onFeito()
  }

  return (
    <article className="card exercise" id={`ex-${ex.id}`}>
      <div className="card-title">
        <span className="ex-num">{String(numero).padStart(2, '0')}</span>
        <h3 style={{ fontSize: 19 }}>{ex.titulo}</h3>
        {feito && <span className="done-mark">✓ feito</span>}
      </div>
      <p>{ex.enunciado}</p>
      <SqlEditor label={`Consulta do exercício ${numero}`} value={sql} onChange={setSql} onRun={() => q.rodar(sql)} />
      <div className="controls">
        <button className="btn" onClick={() => q.rodar(sql)} disabled={q.carregando}>
          Rodar
        </button>
        <button className="btn primary" onClick={conferir} disabled={q.carregando || sql.trim() === INICIAL.trim()}>
          Conferir resposta
        </button>
      </div>
      {q.erro && <p className="error">{q.erro}</p>}
      {correcao && <p className={`feedback ${correcao.ok ? 'ok' : 'bad'}`} aria-live="polite">{correcao.mensagem}</p>}
      {q.resultado && <ResultTable r={q.resultado} />}
      <details>
        <summary>Ver dica</summary>
        <p className="callout">{ex.dica}</p>
      </details>
      <details>
        <summary>Ver uma solução</summary>
        <div className="prose">
          <Code sql={ex.solucao} />
          <p>{ex.comentario}</p>
        </div>
      </details>
    </article>
  )
}

import { useEffect, useState } from 'react'
import { NIVEIS } from '../../data/exercicios'
import { ExerciseCard } from './ExerciseCard'

const CHAVE = 'wf-exercicios-feitos'

function lerFeitos(): string[] {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) ?? '[]')
  } catch {
    return []
  }
}

/** Lista extra com o banco loja, dividida por nível. O progresso fica salvo só neste navegador. */
export function ExerciseList() {
  const [feitos, setFeitos] = useState<string[]>(lerFeitos)
  const total = NIVEIS.reduce((n, l) => n + l.exercicios.length, 0)

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(feitos))
    } catch {
      /* sem armazenamento: o progresso vale só nesta visita */
    }
  }, [feitos])

  let numero = 0
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700 }}>
            {feitos.length} de {total} exercícios feitos
          </p>
          <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, marginTop: 8 }}>
            <div style={{ height: 6, width: `${(feitos.length / total) * 100}%`, background: 'var(--lime)', borderRadius: 3, transition: 'width 300ms' }} />
          </div>
        </div>
      </div>
      {NIVEIS.map((nivel, i) => (
        <section key={nivel.nome} id={`nivel-${i + 1}`} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="level-head">
            <h3>{nivel.nome}</h3>
            <p className="lead" style={{ fontSize: 16 }}>{nivel.resumo}</p>
          </div>
          {nivel.exercicios.map((ex) => {
            numero += 1
            return (
              <ExerciseCard
                key={ex.id}
                ex={ex}
                numero={numero}
                feito={feitos.includes(ex.id)}
                onFeito={() => setFeitos((f) => (f.includes(ex.id) ? f : [...f, ex.id]))}
              />
            )
          })}
        </section>
      ))}
    </div>
  )
}

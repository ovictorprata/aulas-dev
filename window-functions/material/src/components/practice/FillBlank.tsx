import { useState } from 'react'
import { highlight } from '../../lib/highlight'

export type Blank = { id: string; options: string[]; answer: string }
type Props = { pedido: string; parts: (string | Blank)[]; explicacao: string }

/** Exercício de completar: o aluno escolhe a peça que falta em cada lacuna do código. */
export function FillBlank({ pedido, parts, explicacao }: Props) {
  const blanks = parts.filter((p): p is Blank => typeof p !== 'string')
  const [values, setValues] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)

  const allFilled = blanks.every((b) => values[b.id])
  const allOk = blanks.every((b) => values[b.id] === b.answer)

  return (
    <div className="card exercise">
      <div className="card-title">
        <span className="badge">Complete</span>
      </div>
      <p>{pedido}</p>
      <pre className="code" style={{ whiteSpace: 'pre-wrap' }}>
        {parts.map((p, i) =>
          typeof p === 'string' ? (
            <span key={i}>{highlight(p)}</span>
          ) : (
            <select
              key={i}
              aria-label="Lacuna"
              className={`blank ${checked ? (values[p.id] === p.answer ? 'ok' : 'bad') : ''}`}
              value={values[p.id] ?? ''}
              onChange={(e) => {
                setValues({ ...values, [p.id]: e.target.value })
                setChecked(false)
              }}
            >
              <option value="" disabled>
                ______
              </option>
              {p.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ),
        )}
      </pre>
      <div className="controls">
        <button className="btn primary" disabled={!allFilled} onClick={() => setChecked(true)}>
          Conferir
        </button>
        {checked && !allOk && (
          <button className="btn ghost" onClick={() => { setValues({}); setChecked(false) }}>
            Tentar de novo
          </button>
        )}
      </div>
      {checked && (
        <p className={`feedback ${allOk ? 'ok' : 'bad'}`} aria-live="polite">
          {allOk ? `Isso! ${explicacao}` : 'Ainda não. As lacunas em vermelho estão erradas: releia o pedido e tente outra peça.'}
        </p>
      )}
    </div>
  )
}

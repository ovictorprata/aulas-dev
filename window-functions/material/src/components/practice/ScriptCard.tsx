import { SCHEMAS, scriptMySQL } from '../../data/schemas'
import type { Banco } from '../../lib/sql'
import { Code } from '../ui/Code'
import { useCopiar } from '../ui/useCopiar'

type Props = { banco: Banco; descricao: string }

/** Baixa o texto como arquivo .sql, sem precisar de servidor. */
function baixar(nome: string, texto: string) {
  const url = URL.createObjectURL(new Blob([texto], { type: 'application/sql;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = nome
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Um banco para o Workbench: o que tem nele, baixar, copiar e ver o script. */
export function ScriptCard({ banco, descricao }: Props) {
  const script = scriptMySQL(banco)
  const { copiado, copiar } = useCopiar()
  return (
    <article className="card" aria-label={`Script do banco ${banco}`}>
      <div className="card-title">
        <span className="badge">{banco}.sql</span>
      </div>
      <p style={{ color: 'var(--text-2)' }}>{descricao}</p>
      <div className="schema">
        {SCHEMAS[banco].map((t) => (
          <div className="t" key={t.nome}>
            <b>{t.nome}</b>
            <p>{t.colunas.join(', ')}</p>
          </div>
        ))}
      </div>
      <div className="controls">
        <button className="btn primary" onClick={() => baixar(`${banco}.sql`, script)}>
          Baixar {banco}.sql
        </button>
        <button className="btn" onClick={() => copiar(script)}>
          {copiado ? 'Script copiado' : 'Copiar script'}
        </button>
      </div>
      <details>
        <summary>Ver o script</summary>
        <Code sql={script} label={`Script do banco ${banco}`} />
      </details>
    </article>
  )
}

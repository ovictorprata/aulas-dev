import { USOS } from '../../data/usos'
import { Code } from '../ui/Code'
import { ResultTable } from '../practice/ResultTable'

/** Cartão "Na prática": o que a função faz, um exemplo de negócio e onde ela aparece no trabalho. */
export function NaPratica({ chave }: { chave: keyof typeof USOS }) {
  const u = USOS[chave]
  const ex = u.exemplo
  return (
    <article className="card pratica" aria-label={`${u.funcao} na prática`}>
      <header className="pratica-head">
        <span className="badge">{u.funcao}</span>
        <span className="pratica-tag">Na prática</span>
      </header>
      <p className="pratica-faz">{u.oQueFaz}</p>

      <div className="pratica-ex">
        <p className="pratica-label">Exemplo · {ex.area}</p>
        <p className="pratica-pergunta">{ex.pergunta}</p>
        <Code sql={ex.sql} />
        <ResultTable r={{ columns: ex.colunas, values: ex.linhas }} destaque={ex.destaque} semContagem />
        <p className="pratica-conclusao">{ex.conclusao}</p>
      </div>

      <div>
        <p className="pratica-label">Onde aparece no trabalho</p>
        <ul className="usos">
          {u.onde.map((o) => (
            <li key={o.area}>
              <span className="usos-area">{o.area}</span>
              <span>{o.texto}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

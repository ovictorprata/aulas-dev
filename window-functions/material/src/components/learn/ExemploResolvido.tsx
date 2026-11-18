import type { Exemplo } from '../../data/usos'
import { Code } from '../ui/Code'
import { ResultTable } from '../practice/ResultTable'

/** Um exemplo já resolvido: a pergunta, a consulta, o resultado e o que observar nele. */
export function ExemploResolvido({ ex, rotulo = 'Exemplo' }: { ex: Exemplo; rotulo?: string }) {
  return (
    <div className="pratica-ex">
      <p className="pratica-label">
        {rotulo} · {ex.area}
      </p>
      <p className="pratica-pergunta">{ex.pergunta}</p>
      <Code sql={ex.sql} />
      <ResultTable r={{ columns: ex.colunas, values: ex.linhas }} destaque={ex.destaque} semContagem />
      <p className="pratica-conclusao">{ex.conclusao}</p>
    </div>
  )
}

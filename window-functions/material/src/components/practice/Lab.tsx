import { useState } from 'react'
import { Segmented } from '../ui/Segmented'
import { SqlEditor } from './SqlEditor'
import { ResultTable } from './ResultTable'
import { useQuery } from './useQuery'
import { scriptMySQL, SCHEMAS } from '../../data/schemas'
import type { Banco } from '../../lib/sql'

const EXEMPLOS: Record<Banco, string> = {
  spotify: `SELECT usuario, musica, plays,
       RANK() OVER (PARTITION BY usuario ORDER BY plays DESC) AS posicao
FROM mais_ouvidas;`,
  loja: `SELECT nome, loja_id, salario,
       AVG(salario) OVER (PARTITION BY loja_id) AS media_loja
FROM funcionarios;`,
}

/** Editor livre: escolhe o banco, escreve a consulta e vê o resultado na hora. */
export function Lab() {
  const [banco, setBanco] = useState<Banco>('spotify')
  const [sql, setSql] = useState(EXEMPLOS.spotify)
  const [copiado, setCopiado] = useState(false)
  const q = useQuery(banco)

  function trocar(b: Banco) {
    setBanco(b)
    setSql(EXEMPLOS[b])
    q.limpar()
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(scriptMySQL(banco))
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <div className="card" style={{ gap: 16 }}>
      <div className="controls">
        <Segmented
          label="Banco"
          value={banco}
          onChange={trocar}
          options={[
            { value: 'spotify', label: 'Banco spotify' },
            { value: 'loja', label: 'Banco loja' },
          ]}
        />
        <button className="btn ghost" onClick={copiar} style={{ marginLeft: 'auto' }}>
          {copiado ? 'Script copiado' : 'Copiar script para o Workbench'}
        </button>
      </div>
      <div className="schema">
        {SCHEMAS[banco].map((t) => (
          <div className="t" key={t.nome}>
            <b>{t.nome}</b>
            <p>{t.colunas.join(', ')}</p>
          </div>
        ))}
      </div>
      <SqlEditor label="Consulta SQL" value={sql} onChange={setSql} onRun={() => q.rodar(sql)} />
      <div className="controls">
        <button className="btn primary" onClick={() => q.rodar(sql)} disabled={q.carregando}>
          {q.carregando ? 'Rodando…' : 'Rodar'}
        </button>
        <span className="result-meta">ou Ctrl + Enter</span>
      </div>
      {q.erro && <p className="error">{q.erro}</p>}
      {q.resultado && <ResultTable r={q.resultado} />}
    </div>
  )
}

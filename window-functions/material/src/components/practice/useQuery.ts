import { useState } from 'react'
import { executar, explicarErro, type Banco, type Resultado } from '../../lib/sql'

/** Roda uma consulta no banco do navegador e guarda resultado, erro e carregamento. */
export function useQuery(banco: Banco) {
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  async function rodar(sql: string): Promise<Resultado | null> {
    setCarregando(true)
    setErro(null)
    try {
      const r = await executar(banco, sql)
      setResultado(r)
      return r
    } catch (e) {
      setResultado(null)
      setErro(explicarErro(e instanceof Error ? e.message : String(e)))
      return null
    } finally {
      setCarregando(false)
    }
  }

  return { resultado, erro, carregando, rodar, limpar: () => { setResultado(null); setErro(null) } }
}

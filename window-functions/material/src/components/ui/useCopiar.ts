import { useState } from 'react'

/** Copia um texto e avisa por 2 segundos que deu certo. */
export function useCopiar() {
  const [copiado, setCopiado] = useState(false)

  async function copiar(texto: string) {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      setCopiado(false)
    }
  }

  return { copiado, copiar }
}

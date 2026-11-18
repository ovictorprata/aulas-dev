import { useState } from 'react'

export type Tema = 'claro' | 'escuro'

/** Lê e troca o tema da página. A escolha fica salva neste navegador. */
export function useTema() {
  const [tema, setTema] = useState<Tema>(() => (document.documentElement.dataset.tema === 'escuro' ? 'escuro' : 'claro'))

  function alternar() {
    const novo: Tema = tema === 'escuro' ? 'claro' : 'escuro'
    document.documentElement.dataset.tema = novo
    try {
      localStorage.setItem('tema', novo)
    } catch {
      // Sem armazenamento (aba anônima, por exemplo): o tema troca só nesta visita.
    }
    setTema(novo)
  }

  return { tema, alternar }
}

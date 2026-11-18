// Contas feitas em JavaScript para as animações. O resultado é o mesmo que o SQL devolve.
import { MAIS_OUVIDAS, type Musica } from '../data/spotify'

export const porPlaysDesc = (a: Musica, b: Musica) => b.plays - a.plays
export const ordenadas = () => [...MAIS_OUVIDAS].sort(porPlaysDesc)
export const agrupadas = () =>
  [...MAIS_OUVIDAS].sort((a, b) => a.usuario.localeCompare(b.usuario) || b.plays - a.plays)

export type Funcao = 'ROW_NUMBER' | 'RANK' | 'DENSE_RANK'

/** Numera uma lista já ordenada, do jeito de cada função. */
export function numerar(lista: { plays: number }[], fn: Funcao): number[] {
  const out: number[] = []
  let denso = 0
  lista.forEach((m, i) => {
    const empatouComAnterior = i > 0 && lista[i - 1].plays === m.plays
    if (fn === 'ROW_NUMBER') out.push(i + 1)
    else if (fn === 'RANK') out.push(empatouComAnterior ? out[i - 1] : i + 1)
    else {
      if (!empatouComAnterior) denso += 1
      out.push(denso)
    }
  })
  return out
}

/** Numera dentro de cada usuário (o efeito do PARTITION BY). */
export function numerarPorUsuario(lista: Musica[], fn: Funcao): number[] {
  const out: number[] = []
  for (const u of ['Ana', 'Bruno'] as const) {
    const idx = lista.map((m, i) => (m.usuario === u ? i : -1)).filter((i) => i >= 0)
    const nums = numerar(idx.map((i) => lista[i]), fn)
    idx.forEach((i, k) => (out[i] = nums[k]))
  }
  return out
}

export const tom = (u: string) => (u === 'Ana' ? 'a' : 'b') as 'a' | 'b'

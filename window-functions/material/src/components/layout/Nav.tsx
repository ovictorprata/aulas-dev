import { useEffect, useState } from 'react'

export const SECOES = [
  { grupo: 'Aprender', itens: [
    { id: 'tabela', n: '00', t: 'A tabela' },
    { id: 'problema', n: '01', t: 'O problema do GROUP BY' },
    { id: 'anatomia', n: '02', t: 'Função + janela' },
    { id: 'row-number', n: '03', t: 'ROW_NUMBER' },
    { id: 'empates', n: '04', t: 'RANK e DENSE_RANK' },
    { id: 'partition-by', n: '05', t: 'PARTITION BY' },
    { id: 'top-n', n: '06', t: 'Top N com WITH' },
    { id: 'contas', n: '07', t: 'SUM e AVG' },
    { id: 'lag-lead', n: '08', t: 'LAG e LEAD' },
    { id: 'acumulado', n: '09', t: 'Total acumulado' },
  ] },
  { grupo: 'Consultar', itens: [{ id: 'cola', n: '10', t: 'Cola rápida' }] },
  { grupo: 'Praticar', itens: [
    { id: 'laboratorio', n: '11', t: 'Laboratório' },
    { id: 'exercicios', n: '12', t: 'Lista extra' },
  ] },
]
const IDS = SECOES.flatMap((g) => g.itens.map((i) => i.id))

/** Descobre qual seção está na tela para destacar no menu. */
function useSecaoAtiva() {
  const [ativa, setAtiva] = useState(IDS[0])
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        const visiveis = entradas.filter((e) => e.isIntersecting)
        if (visiveis.length) setAtiva(visiveis[0].target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])
  return ativa
}

function useProgresso() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const on = () => {
      const h = document.documentElement
      setP(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight))
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return p
}

export function TopBar({ aberto, onMenu }: { aberto: boolean; onMenu: () => void }) {
  const p = useProgresso()
  return (
    <div className="topbar">
      <a href="#inicio" className="brand" style={{ color: 'inherit', textDecoration: 'none' }}>
        Window <span>Functions</span>
      </a>
      <button className="menu-btn" onClick={onMenu} aria-expanded={aberto} aria-controls="menu">
        {aberto ? 'Fechar' : 'Conteúdo'}
      </button>
      <div className="progress" style={{ width: `${p * 100}%` }} />
    </div>
  )
}

export function Nav({ aberto, onNavegar }: { aberto: boolean; onNavegar: () => void }) {
  const ativa = useSecaoAtiva()
  return (
    <nav id="menu" className={`nav ${aberto ? 'open' : ''}`} aria-label="Conteúdo">
      {SECOES.map((g) => (
        <div key={g.grupo}>
          <p className="group">{g.grupo}</p>
          {g.itens.map((i) => (
            <a key={i.id} href={`#${i.id}`} className={ativa === i.id ? 'active' : ''} onClick={onNavegar} aria-current={ativa === i.id ? 'true' : undefined}>
              <span className="n">{i.n}</span>
              {i.t}
            </a>
          ))}
        </div>
      ))}
    </nav>
  )
}

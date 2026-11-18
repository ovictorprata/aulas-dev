import { useState } from 'react'
import { Nav, TopBar } from './components/layout/Nav'
import { Anatomia, Inicio, Tabela } from './sections/Fundamentos'
import { Empates, Partition, RowNumber } from './sections/Rankings'
import { TopN } from './sections/TopN'
import { Acumulado, Agregadas, LagLead } from './sections/Contas'
import { Cola, Exercicios, Laboratorio, Workbench } from './sections/Pratica'

export default function App() {
  const [menu, setMenu] = useState(false)
  return (
    <div className="app">
      <TopBar aberto={menu} onMenu={() => setMenu((m) => !m)} />
      <Nav aberto={menu} onNavegar={() => setMenu(false)} />
      <main className="main">
        <Inicio />
        <Tabela />
        <RowNumber />
        <Anatomia />
        <Empates />
        <Partition />
        <TopN />
        <Agregadas />
        <LagLead />
        <Acumulado />
        <Cola />
        <Workbench />
        <Laboratorio />
        <Exercicios />
        <p className="footer">Material de apoio da aula de Window Functions · Victor de Sousa Prata</p>
      </main>
    </div>
  )
}

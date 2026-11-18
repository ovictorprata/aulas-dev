import { MAIS_OUVIDAS } from '../../data/spotify'
import { agrupadas, numerarPorUsuario, tom } from '../../lib/spotify'
import { Code, type CodePart } from '../ui/Code'
import { DataTable, type Row } from '../ui/DataTable'
import { StepControls, useSteps } from '../ui/Stepper'

const COLS = [
  { key: 'usuario', label: 'usuario', width: 90 },
  { key: 'musica', label: 'musica', width: 250 },
  { key: 'plays', label: 'plays', width: 70, kind: 'num' as const },
  { key: 'posicao', label: 'posicao', width: 80, kind: 'pos' as const },
]

/** Passo a passo: a tabela misturada se divide em dois pedaços e o ranking recomeça em cada um. */
export function PartitionDemo() {
  const s = useSteps(13)
  const grp = agrupadas()
  const pos = numerarPorUsuario(grp, 'RANK')
  const lista = s.step === 0 ? MAIS_OUVIDAS : grp
  const reveladas = Math.max(0, s.step - 2) // quantas posições já apareceram

  const rows: Row[] = lista.map((m, i) => {
    const mostra = s.step >= 3 && i < reveladas
    const atual = s.step >= 3 && i === reveladas - 1
    return {
      id: m.id,
      tone: atual ? 'hot' : s.step >= 1 ? tom(m.usuario) : undefined,
      flash: atual ? ['posicao'] : undefined,
      cells: { usuario: m.usuario, musica: m.musica, plays: m.plays, posicao: mostra ? pos[i] : '' },
    }
  })

  const code: CodePart[] =
    s.step === 0
      ? [{ text: 'SELECT usuario, musica, plays\nFROM mais_ouvidas;' }]
      : [
          { text: 'SELECT usuario, musica, plays,\n       RANK() OVER (' },
          { text: 'PARTITION BY usuario', mark: s.step <= 2 },
          { text: ' ORDER BY plays DESC) AS posicao\nFROM mais_ouvidas;' },
        ]

  const atual = grp[reveladas - 1]
  const texto =
    s.step === 0 ? (
      <>No banco, as músicas da Ana e do Bruno estão <b>misturadas</b>. Para fazer o ranking de cada pessoa, o primeiro passo é separar.</>
    ) : s.step === 1 ? (
      <>O <b>PARTITION BY usuario</b> divide a tabela em dois pedaços: um só da Ana, outro só do Bruno.</>
    ) : s.step === 2 ? (
      <>Dentro de cada pedaço, o <b>ORDER BY plays DESC</b> ordena do mais ouvido para o menos ouvido. A conta ainda não começou.</>
    ) : s.step === 8 ? (
      <>Começou o pedaço do Bruno: <b>a conta recomeça do 1</b>. Jetski é o 1º dele.</>
    ) : (
      <>
        <b>{atual.musica}</b> fica em <b>{pos[reveladas - 1]}º</b> no ranking {atual.usuario === 'Ana' ? 'da Ana' : 'do Bruno'}.
        {s.step === 6 && ' Empatou com Swim (87 plays): o RANK repete o 3º.'}
        {s.step === 7 && ' Depois do empate, o RANK pula o 4º.'}
      </>
    )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Code parts={code} />
      <DataTable caption="Ranking por pessoa" columns={COLS} rows={rows} />
      <StepControls s={s} text={texto} />
    </div>
  )
}

import { ACESSOS } from '../../data/spotify'
import { Code } from '../ui/Code'
import { DataTable, type Row } from '../ui/DataTable'
import { StepControls, useSteps } from '../ui/Stepper'

const ANA = ACESSOS.filter((a) => a.usuario === 'Ana')

/** Passo a passo do total acumulado: cada linha soma tudo que veio antes dela. */
export function RunningDemo() {
  const s = useSteps(ANA.length + 1)
  let soma = 0
  const acum = ANA.map((a) => (soma += a.minutos))

  const rows: Row[] = ANA.map((a, i) => ({
    id: a.id,
    tone: i === s.step - 1 ? 'hot' : i < s.step - 1 ? 'a' : undefined,
    flash: i === s.step - 1 ? ['acumulado'] : undefined,
    cells: { data: a.data_acesso, minutos: a.minutos, acumulado: i < s.step ? acum[i] : '' },
  }))

  const i = s.step - 1
  const texto =
    s.step === 0 ? (
      <>Os acessos da Ana em ordem de data. Com <b>ORDER BY dentro do OVER</b>, o SUM deixa de somar o grupo todo e passa a somar <b>do começo até a linha atual</b>.</>
    ) : (
      <>
        Em {ANA[i].data_acesso}: {i === 0 ? `só existe esta linha, então o acumulado é ${acum[0]}.` : `${acum[i - 1]} que já vinham somados + ${ANA[i].minutos} de hoje = `}
        {i > 0 && <b>{acum[i]}</b>}
      </>
    )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Code
        parts={[
          { text: "SELECT data_acesso, minutos,\n       SUM(minutos) OVER (" },
          { text: 'ORDER BY data_acesso', mark: true },
          { text: ") AS acumulado\nFROM acessos\nWHERE usuario = 'Ana';" },
        ]}
      />
      <DataTable
        caption="Total acumulado"
        columns={[
          { key: 'data', label: 'data_acesso', width: 130 },
          { key: 'minutos', label: 'minutos', width: 90, kind: 'num' },
          { key: 'acumulado', label: 'acumulado', width: 110, kind: 'pos' },
        ]}
        rows={rows}
      />
      <StepControls s={s} text={texto} />
    </div>
  )
}

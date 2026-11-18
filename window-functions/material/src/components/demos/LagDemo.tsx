import { useState } from 'react'
import { ACESSOS } from '../../data/spotify'
import { tom } from '../../lib/spotify'
import { Code } from '../ui/Code'
import { DataTable, type Row } from '../ui/DataTable'
import { Segmented } from '../ui/Segmented'
import { StepControls, useSteps } from '../ui/Stepper'

/** Passo a passo: cada linha busca o valor da linha de cima (LAG) ou de baixo (LEAD) do mesmo usuário. */
export function LagDemo() {
  const [fn, setFn] = useState<'LAG' | 'LEAD'>('LAG')
  const s = useSteps(ACESSOS.length + 1)
  const feitas = s.step // linhas já preenchidas

  const vizinho = (i: number) => {
    const j = fn === 'LAG' ? i - 1 : i + 1
    return ACESSOS[j] && ACESSOS[j].usuario === ACESSOS[i].usuario ? j : -1
  }
  const ordem = fn === 'LAG' ? ACESSOS.map((_, i) => i) : ACESSOS.map((_, i) => i)
  const alvo = feitas > 0 ? ordem[feitas - 1] : -1
  const fonte = alvo >= 0 ? vizinho(alvo) : -1
  const col = fn === 'LAG' ? 'anterior' : 'proximo'

  const rows: Row[] = ACESSOS.map((a, i) => {
    const pronta = ordem.indexOf(i) < feitas
    const v = vizinho(i)
    return {
      id: a.id,
      tone: i === alvo ? 'hot' : tom(a.usuario),
      flash: [...(i === alvo ? [col] : []), ...(i === fonte ? ['minutos'] : [])],
      cells: { usuario: a.usuario, data: a.data_acesso, minutos: a.minutos, [col]: pronta ? (v >= 0 ? ACESSOS[v].minutos : 'NULL') : '' },
      cellTone: pronta && v < 0 ? { [col]: 'muted' } : undefined,
    }
  })

  const texto =
    feitas === 0 ? (
      <>Cada linha é um dia em que a pessoa abriu o app. O <b>{fn}</b> vai buscar os minutos da linha {fn === 'LAG' ? 'de cima' : 'de baixo'}, sempre dentro da mesma pessoa.</>
    ) : fonte < 0 ? (
      <>
        {ACESSOS[alvo].data_acesso} da {ACESSOS[alvo].usuario === 'Ana' ? 'Ana' : 'do Bruno'}: não existe linha {fn === 'LAG' ? 'antes' : 'depois'} <b>dentro deste pedaço</b>, então vem <b>NULL</b>. O PARTITION BY não deixa pegar o valor da outra pessoa.
      </>
    ) : (
      <>
        Em {ACESSOS[alvo].data_acesso}, a linha recebe os <b>{ACESSOS[fonte].minutos} minutos</b> de {ACESSOS[fonte].data_acesso}, a linha {fn === 'LAG' ? 'de cima' : 'de baixo'}.
      </>
    )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Segmented
        label="Função"
        value={fn}
        onChange={(f) => {
          setFn(f)
          s.reset()
        }}
        options={[
          { value: 'LAG', label: 'LAG · linha de cima' },
          { value: 'LEAD', label: 'LEAD · linha de baixo' },
        ]}
      />
      <Code
        parts={[
          { text: 'SELECT usuario, data_acesso, minutos,\n       ' },
          { text: `${fn}(minutos)`, mark: true },
          { text: ` OVER (PARTITION BY usuario ORDER BY data_acesso) AS ${col}\nFROM acessos;` },
        ]}
      />
      <DataTable
        caption="acessos"
        columns={[
          { key: 'usuario', label: 'usuario', width: 90 },
          { key: 'data', label: 'data_acesso', width: 130 },
          { key: 'minutos', label: 'minutos', width: 90, kind: 'num' },
          { key: col, label: col, width: 100, kind: 'pos' },
        ]}
        rows={rows}
      />
      <StepControls s={s} text={texto} />
    </div>
  )
}

import { MAIS_OUVIDAS } from '../../data/spotify'
import { ordenadas } from '../../lib/spotify'
import { Code, type CodePart } from '../ui/Code'
import { DataTable, type Row } from '../ui/DataTable'
import { StepControls, useSteps } from '../ui/Stepper'

const COLS = [
  { key: 'usuario', label: 'usuario', width: 90 },
  { key: 'musica', label: 'musica', width: 250 },
  { key: 'plays', label: 'plays', width: 70, kind: 'num' as const },
  { key: 'posicao', label: 'posicao', width: 80, kind: 'pos' as const },
]

/** Passo a passo: a tabela se ordena e o ROW_NUMBER numera uma linha por vez. */
export function RowNumberDemo() {
  const s = useSteps(13)
  const ord = ordenadas()
  const lista = s.step === 0 ? MAIS_OUVIDAS : ord
  const numeradas = Math.max(0, s.step - 2)

  const rows: Row[] = lista.map((m, i) => ({
    id: m.id,
    cells: { usuario: m.usuario, musica: m.musica, plays: m.plays, posicao: s.step >= 3 && i < numeradas ? i + 1 : '' },
    flash: s.step >= 3 && i === numeradas - 1 ? ['posicao'] : undefined,
    tone: s.step >= 3 && i === numeradas - 1 ? 'hot' : undefined,
  }))

  const code: CodePart[] =
    s.step === 0
      ? [{ text: 'SELECT usuario, musica, plays\nFROM mais_ouvidas;' }]
      : s.step === 1
        ? [{ text: 'SELECT usuario, musica, plays\nFROM mais_ouvidas\n' }, { text: 'ORDER BY plays DESC', mark: true }, { text: ';' }]
        : [
            { text: 'SELECT usuario, musica, plays,\n       ' },
            { text: 'ROW_NUMBER()', mark: s.step >= 3 },
            { text: ' OVER (' },
            { text: 'ORDER BY plays DESC', mark: s.step === 2 },
            { text: ') AS posicao\nFROM mais_ouvidas;' },
          ]

  const atual = ord[numeradas - 1]
  const texto =
    s.step === 0 ? (
      <>A tabela como ela está no banco, sem ordem nenhuma. Queremos uma coluna dizendo <b>1º, 2º, 3º…</b></>
    ) : s.step === 1 ? (
      <>Primeiro, ordenamos do maior para o menor número de plays. As linhas trocam de lugar.</>
    ) : s.step === 2 ? (
      <>O ORDER BY <b>sobe para dentro do OVER</b>. Agora ele diz como a janela enxerga a tabela, e o ROW_NUMBER vai numerar nessa ordem.</>
    ) : (
      <>
        O ROW_NUMBER desce uma linha: <b>{atual.musica}</b> recebe o número <b>{numeradas}</b>.
        {numeradas === 7 && ' Repare: ela tem os mesmos 87 plays da linha de cima, mas ganhou um número diferente.'}
      </>
    )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Code parts={code} />
      <DataTable caption="mais_ouvidas" columns={COLS} rows={rows} />
      <StepControls s={s} text={texto} />
    </div>
  )
}

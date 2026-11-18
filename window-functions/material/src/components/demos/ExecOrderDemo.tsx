import { Code, type CodePart } from '../ui/Code'
import { StepControls, useSteps } from '../ui/Stepper'

const ETAPAS = [
  { k: 'FROM', d: 'pega a tabela' },
  { k: 'WHERE', d: 'filtra as linhas' },
  { k: 'SELECT', d: 'calcula as colunas' },
  { k: 'ORDER BY', d: 'ordena o resultado' },
]

const TEXTOS = [
  <>A gente escreve o SELECT primeiro, mas o banco <b>não executa nessa ordem</b>. Ele começa pelo FROM: qual tabela usar.</>,
  <>Depois vem o <b>WHERE</b>, que filtra as linhas. Ele pede <code>posicao &lt;= 3</code>… mas a coluna posicao ainda não existe.</>,
  <>Só agora vem o <b>SELECT</b>, que calcula as colunas. A <b>window function é calculada aqui</b>, no 3º passo. Tarde demais para o WHERE.</>,
  <>Por último, o ORDER BY. Como ele vem depois do SELECT, ele <b>pode</b> usar a coluna posicao. O WHERE, não.</>,
]

const MARCA: Record<number, string> = { 0: 'from', 1: 'where', 2: 'select', 3: 'select' }

/** Passo a passo da ordem de execução, marcando no código a linha de cada etapa. */
export function ExecOrderDemo() {
  const s = useSteps(4)
  const m = MARCA[s.step]
  const code: CodePart[] = [
    { text: 'SELECT usuario, musica, plays,\n       RANK() OVER (PARTITION BY usuario ORDER BY plays DESC) AS posicao', mark: m === 'select' },
    { text: '\n' },
    { text: 'FROM mais_ouvidas', mark: m === 'from' },
    { text: '\n' },
    { text: 'WHERE posicao <= 3', mark: m === 'where' },
    { text: ';' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Code parts={code} />
      <div className="flow">
        {ETAPAS.map((e, i) => (
          <div key={e.k} className={`stp ${i > s.step ? 'off' : ''} ${i === s.step ? (i === 1 ? 'warn' : 'on') : ''}`}>
            <span className="n">{i + 1}º</span>
            <span className="k">{e.k}</span>
            <p>{e.d}</p>
            {i === 2 && <span className="tag">window function</span>}
          </div>
        ))}
      </div>
      <StepControls s={s} text={TEXTOS[s.step]} />
    </div>
  )
}

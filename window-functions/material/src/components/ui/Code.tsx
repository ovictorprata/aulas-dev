import { highlight } from '../../lib/highlight'

/** Um trecho do código. `mark` destaca em verde; `dim` apaga o que não importa naquele passo. */
export type CodePart = { text: string; mark?: boolean; dim?: boolean }

type Props = { sql?: string; parts?: CodePart[]; label?: string }

export function Code({ sql, parts, label }: Props) {
  const list: CodePart[] = parts ?? [{ text: sql ?? '' }]
  return (
    <pre className="code" aria-label={label ?? 'Código SQL'}>
      {list.map((p, i) => (
        <span key={i} className={p.mark ? 'hl' : p.dim ? 'dim' : undefined}>
          {highlight(p.text)}
        </span>
      ))}
    </pre>
  )
}

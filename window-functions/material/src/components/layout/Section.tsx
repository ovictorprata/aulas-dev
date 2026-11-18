import type { ReactNode } from 'react'

type Props = { id: string; numero?: string; titulo: string; lead?: ReactNode; children: ReactNode }

export function Section({ id, numero, titulo, lead, children }: Props) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-t`}>
      {numero && <span className="eyebrow">{numero}</span>}
      <h2 id={`${id}-t`}>{titulo}</h2>
      {lead && <p className="lead">{lead}</p>}
      {children}
    </section>
  )
}

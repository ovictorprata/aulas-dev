import { useEffect, useState, type ReactNode } from 'react'

/** Controla um passo a passo: avança, volta, reinicia e toca sozinho. */
export function useSteps(total: number) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    if (step >= total - 1) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1100)
    return () => clearTimeout(t)
  }, [playing, step, total])

  return {
    step,
    total,
    playing,
    next: () => setStep((s) => Math.min(s + 1, total - 1)),
    prev: () => setStep((s) => Math.max(s - 1, 0)),
    reset: () => {
      setPlaying(false)
      setStep(0)
    },
    toggle: () => {
      if (step >= total - 1) setStep(0)
      setPlaying((p) => !p)
    },
  }
}

type Props = { s: ReturnType<typeof useSteps>; text: ReactNode }

export function StepControls({ s, text }: Props) {
  return (
    <div className="card" style={{ gap: 12 }}>
      <p className="step-text" aria-live="polite">{text}</p>
      <div className="controls">
        <button className="btn" onClick={s.prev} disabled={s.step === 0}>
          ← Voltar
        </button>
        <button className="btn primary" onClick={s.next} disabled={s.step === s.total - 1}>
          Próximo passo →
        </button>
        <button className="btn ghost" onClick={s.toggle}>
          {s.playing ? 'Pausar' : 'Tocar sozinho'}
        </button>
        <button className="btn ghost" onClick={s.reset} disabled={s.step === 0}>
          Recomeçar
        </button>
        <span className="step-count">
          {s.step + 1} / {s.total}
        </span>
      </div>
    </div>
  )
}

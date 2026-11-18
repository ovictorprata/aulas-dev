import { highlight } from '../../lib/highlight'

type Props = { value: string; onChange: (v: string) => void; onRun: () => void; label: string }

/** Editor com cores: um textarea transparente por cima do código colorido. Ctrl+Enter roda. */
export function SqlEditor({ value, onChange, onRun, label }: Props) {
  return (
    <div className="editor">
      <pre aria-hidden="true">{highlight(value + '\n')}</pre>
      <textarea
        aria-label={label}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault()
            onRun()
          }
          if (e.key === 'Tab') {
            e.preventDefault()
            const el = e.currentTarget
            const { selectionStart: s, selectionEnd: f } = el
            onChange(value.slice(0, s) + '  ' + value.slice(f))
            requestAnimationFrame(() => el.setSelectionRange(s + 2, s + 2))
          }
        }}
      />
    </div>
  )
}

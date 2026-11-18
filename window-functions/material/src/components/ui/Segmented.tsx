type Props<T extends string> = { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string }

export function Segmented<T extends string>({ value, options, onChange, label }: Props<T>) {
  return (
    <div className="seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} role="radio" aria-checked={value === o.value} className={value === o.value ? 'on' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

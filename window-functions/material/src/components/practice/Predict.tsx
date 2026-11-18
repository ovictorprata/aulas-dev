import { useState } from 'react'

type Props = { pergunta: string; opcoes: string[]; correta: number; explicacao: string }

/** "Antes de rodar": o aluno chuta o resultado antes de ver. Errar aqui é parte do aprendizado. */
export function Predict({ pergunta, opcoes, correta, explicacao }: Props) {
  const [escolha, setEscolha] = useState<number | null>(null)
  return (
    <div className="card exercise">
      <div className="card-title">
        <span className="badge lilac">Antes de rodar</span>
      </div>
      <p>{pergunta}</p>
      <div className="options">
        {opcoes.map((o, i) => (
          <button
            key={o}
            className={`option ${escolha === null ? '' : i === correta ? 'ok' : i === escolha ? 'bad' : ''}`}
            onClick={() => setEscolha(i)}
            aria-pressed={escolha === i}
          >
            {o}
          </button>
        ))}
      </div>
      {escolha !== null && (
        <p className={`feedback ${escolha === correta ? 'ok' : 'bad'}`} aria-live="polite">
          {escolha === correta ? 'Acertou! ' : 'Não foi dessa vez. '}
          {explicacao}
        </p>
      )}
    </div>
  )
}

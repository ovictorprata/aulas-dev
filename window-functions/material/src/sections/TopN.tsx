import { Section } from '../components/layout/Section'
import { ExecOrderDemo } from '../components/demos/ExecOrderDemo'
import { Code } from '../components/ui/Code'
import { DataTable } from '../components/ui/DataTable'
import { FillBlank } from '../components/practice/FillBlank'
import { agrupadas, numerarPorUsuario, tom } from '../lib/spotify'

const CTE = `WITH ranking AS (
  SELECT usuario, musica, plays,
         RANK() OVER (PARTITION BY usuario ORDER BY plays DESC) AS posicao
  FROM mais_ouvidas
)
SELECT * FROM ranking
WHERE posicao <= 3;`

export function TopN() {
  const grp = agrupadas()
  const pos = numerarPorUsuario(grp, 'RANK')
  const top = grp.map((m, i) => ({ m, p: pos[i] })).filter((x) => x.p <= 3)
  return (
    <Section id="top-n" numero="05 · Top N com WITH" titulo="As 3 músicas que cada pessoa mais ouviu" lead="Com o ranking pronto, parece que basta um WHERE. Não basta.">
      <div className="prose">
        <p>
          A tentativa óbvia é colocar <code>WHERE posicao &lt;= 3</code> no fim da consulta. O MySQL responde com erro: <code>Unknown column 'posicao' in 'where clause'</code>.
          A coluna está ali no SELECT… por que ele diz que ela não existe?
        </p>
        <p>A resposta está na ordem em que o banco executa a consulta:</p>
      </div>
      <ExecOrderDemo />
      <div className="prose">
        <h3>A solução: primeiro calcula, depois filtra</h3>
        <p>
          O <code>WITH</code> (também chamado de CTE) dá um nome para uma consulta, como salvar um rascunho para usar depois. Dentro dele a gente calcula o ranking. Fora
          dele, o SELECT usa esse rascunho <strong>como se fosse uma tabela</strong>, e aí a coluna posicao já existe.
        </p>
      </div>
      <Code sql={CTE} />
      <DataTable
        caption="Top 3 de cada pessoa"
        columns={[
          { key: 'usuario', label: 'usuario', width: 90 },
          { key: 'musica', label: 'musica', width: 250 },
          { key: 'plays', label: 'plays', width: 70, kind: 'num' },
          { key: 'posicao', label: 'posicao', width: 80, kind: 'pos' },
        ]}
        rows={top.map(({ m, p }) => ({ id: m.id, tone: m.plays === 87 ? 'hot' : tom(m.usuario), cells: { usuario: m.usuario, musica: m.musica, plays: m.plays, posicao: p } }))}
      />
      <div className="callout">
        <b>A Ana veio com 4 músicas.</b> Swim e P do Pecado empataram em 3º. Isso é bug? Depende do negócio: se o app mostra exatamente 3 músicas, use{' '}
        <code>ROW_NUMBER</code>; se é justo mostrar quem empatou, use <code>RANK</code>. Escolher a função é uma decisão de negócio, não decoreba.
      </div>
      <FillBlank
        pedido="O Marketing quer só a música menos ouvida de cada pessoa, sempre uma por pessoa. Complete:"
        parts={[
          'WITH ranking AS (\n  SELECT usuario, musica, plays,\n         ',
          { id: 'f', options: ['ROW_NUMBER', 'RANK', 'DENSE_RANK'], answer: 'ROW_NUMBER' },
          '() OVER (PARTITION BY usuario ORDER BY plays ',
          { id: 'o', options: ['ASC', 'DESC'], answer: 'ASC' },
          ') AS posicao\n  FROM mais_ouvidas\n)\nSELECT * FROM ',
          { id: 't', options: ['ranking', 'mais_ouvidas'], answer: 'ranking' },
          '\nWHERE posicao = 1;',
        ]}
        explicacao="ROW_NUMBER garante uma só por pessoa, ASC põe a menos ouvida em 1º e o filtro é feito no ranking. Resultado: Anunciação e Eu Te Seguro."
      />
    </Section>
  )
}

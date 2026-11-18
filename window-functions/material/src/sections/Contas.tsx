import { NaPratica } from '../components/learn/NaPratica'
import { Section } from '../components/layout/Section'
import { AggDemo } from '../components/demos/AggDemo'
import { LagDemo } from '../components/demos/LagDemo'
import { RunningDemo } from '../components/demos/RunningDemo'
import { FillBlank } from '../components/practice/FillBlank'
import { Code } from '../components/ui/Code'
import { DataTable } from '../components/ui/DataTable'
import { ASSINATURAS } from '../data/spotify'

export function Agregadas() {
  return (
    <Section id="contas" numero="06 · SUM e AVG" titulo="Contas do grupo, linha por linha" lead="Numerar é só uma das contas. Somar e tirar a média também funcionam com OVER.">
      <div className="prose">
        <p>
          <code>SUM</code>, <code>AVG</code>, <code>MAX</code>, <code>MIN</code> e <code>COUNT</code> podem virar window functions: é só colocar um <code>OVER</code>{' '}
          depois delas. A conta é feita sobre a janela, e o resultado aparece em cada linha.
        </p>
        <p>
          Por que isso é útil? Porque com o total ou a média na mesma linha, você consegue comparar cada linha com o grupo dela: quanto essa música está acima da média da
          pessoa, quanto esse salário está abaixo da média da loja, e assim por diante.
        </p>
      </div>
      <AggDemo />
      <NaPratica chave="SUM" />
      <NaPratica chave="AVG" />
      <FillBlank
        pedido="O time de Produto quer saber quanto cada música está acima ou abaixo da média da pessoa. Complete:"
        parts={[
          'SELECT usuario, musica, plays,\n       plays - ',
          { id: 'f', options: ['SUM', 'AVG', 'COUNT'], answer: 'AVG' },
          '(plays) OVER (',
          { id: 'p', options: ['PARTITION BY usuario', 'ORDER BY plays'], answer: 'PARTITION BY usuario' },
          ') AS diferenca\nFROM mais_ouvidas;',
        ]}
        explicacao="A média da Ana é 89,8. Swim, com 87 plays, fica 2,8 abaixo."
      />
    </Section>
  )
}

export function LagLead() {
  return (
    <Section id="lag-lead" numero="07 · LAG e LEAD" titulo="Olhando para a linha vizinha" lead="Hoje a pessoa ouviu mais ou menos que no dia anterior?">
      <div className="prose">
        <p>
          O <code>LAG</code> pega um valor da <strong>linha de cima</strong>; o <code>LEAD</code>, da <strong>linha de baixo</strong>. As mesmas duas partes de sempre: a
          conta é "me dá o valor da vizinha", e a janela diz quem é vizinha de quem (por usuário, em ordem de data).
        </p>
        <p>Usamos a tabela <code>acessos</code>: cada linha é um dia em que a pessoa abriu o app, com os minutos ouvidos.</p>
      </div>
      <LagDemo />
      <div className="prose">
        <h3>Com o vizinho na linha, comparar é uma subtração</h3>
        <p>
          <code>minutos - LAG(minutos) OVER (...)</code> mostra quanto a pessoa ouviu a mais (positivo) ou a menos (negativo) que no acesso anterior. No dia 10/11, o
          Bruno ouviu 120 minutos: 73 a mais que no dia 9.
        </p>
      </div>
      <div className="prose">
        <h3>Outro exemplo: assinaturas por plano</h3>
        <p>A mesma ideia serve para qualquer número que muda com o tempo. A janela agora separa por plano:</p>
      </div>
      <Code
        sql={`SELECT mes, plano, novas_assinaturas,
       novas_assinaturas - LAG(novas_assinaturas)
         OVER (PARTITION BY plano ORDER BY mes) AS crescimento
FROM assinaturas;`}
      />
      <DataTable
        caption="assinaturas"
        columns={[
          { key: 'mes', label: 'mes', width: 90 },
          { key: 'plano', label: 'plano', width: 140 },
          { key: 'n', label: 'novas_assinaturas', width: 170, kind: 'num' },
          { key: 'c', label: 'crescimento', width: 120, kind: 'pos' },
        ]}
        rows={ASSINATURAS.map(([mes, plano, n], i) => {
          const ant = i > 0 && ASSINATURAS[i - 1][1] === plano ? ASSINATURAS[i - 1][2] : null
          const c = ant === null ? null : n - ant
          return {
            id: `${mes}-${plano}`,
            tone: mes === '2026-08' && plano === 'Universitário' ? 'hot' : plano === 'Individual' ? 'a' : 'b',
            cells: { mes, plano, n, c: c === null ? 'NULL' : c > 0 ? `+${c}` : `−${-c}` },
            cellTone: c === null ? { c: 'muted' } : c < 0 ? { c: 'neg' } : undefined,
          }
        })}
      />
      <p className="lead" style={{ fontSize: 16 }}>O plano Universitário cresceu 550 em agosto: volta às aulas.</p>
      <NaPratica chave="LAG" />
      <NaPratica chave="LEAD" />
      <FillBlank
        pedido="Complete para mostrar os minutos do próximo acesso de cada pessoa:"
        parts={[
          'SELECT usuario, data_acesso, minutos,\n       ',
          { id: 'f', options: ['LAG', 'LEAD'], answer: 'LEAD' },
          '(minutos) OVER (PARTITION BY usuario ORDER BY ',
          { id: 'o', options: ['data_acesso', 'minutos'], answer: 'data_acesso' },
          ') AS proximo\nFROM acessos;',
        ]}
        explicacao="LEAD olha para a linha de baixo, e a ordem que faz sentido é a do tempo. O último acesso de cada pessoa vem com NULL."
      />
    </Section>
  )
}

export function Acumulado() {
  return (
    <Section id="acumulado" numero="08 · Bônus" titulo="Total acumulado" lead="O que acontece quando o SUM ganha um ORDER BY dentro do OVER.">
      <div className="prose">
        <p>
          Sem ORDER BY, o SUM soma o pedaço inteiro. Com ORDER BY, ele soma <strong>do começo do pedaço até a linha atual</strong>. É o famoso "acumulado no mês", o saldo
          de um extrato, o faturamento até hoje.
        </p>
      </div>
      <RunningDemo />
      <div className="callout red">
        <b>Pegadinha do empate:</b> se duas linhas tiverem o mesmo valor no ORDER BY, o acumulado soma as duas de uma vez e repete o resultado. Para somar uma linha por
        vez, desempate com mais uma coluna (como um id) ou escreva <code>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> dentro do OVER.
      </div>
      <NaPratica chave="ACUMULADO" />
    </Section>
  )
}

import { Section } from '../components/layout/Section'
import { RowNumberDemo } from '../components/demos/RowNumberDemo'
import { TieDemo } from '../components/demos/TieDemo'
import { PartitionDemo } from '../components/demos/PartitionDemo'
import { FillBlank } from '../components/practice/FillBlank'
import { Predict } from '../components/practice/Predict'

const FN = ['ROW_NUMBER', 'RANK', 'DENSE_RANK']

export function RowNumber() {
  return (
    <Section id="row-number" numero="03 · ROW_NUMBER" titulo="Numerando as linhas" lead="A primeira window function: dar 1º, 2º, 3º para cada linha.">
      <div className="prose">
        <p>
          O objetivo é uma coluna nova, <code>posicao</code>, dizendo em que lugar cada música ficou. O caminho é sempre o mesmo: primeiro a tabela é ordenada, depois a
          função passa linha por linha.
        </p>
        <p>
          O detalhe que muda tudo: o <code>ORDER BY</code> que você já usaria no fim da consulta <strong>sobe para dentro do OVER</strong>. Ali ele não ordena o resultado
          final; ele diz em que ordem a função deve enxergar as linhas.
        </p>
      </div>
      <RowNumberDemo />
      <FillBlank
        pedido="O Marketing quer as músicas da menos ouvida para a mais ouvida, com a posição de cada uma. Complete:"
        parts={[
          'SELECT musica, plays,\n       ',
          { id: 'f', options: FN, answer: 'ROW_NUMBER' },
          '() OVER (ORDER BY plays ',
          { id: 'o', options: ['ASC', 'DESC'], answer: 'ASC' },
          ') AS posicao\nFROM mais_ouvidas;',
        ]}
        explicacao="ASC ordena do menor para o maior: Eu Te Seguro, com 33 plays, vira a posição 1."
      />
    </Section>
  )
}

export function Empates() {
  return (
    <Section id="empates" numero="04 · RANK e DENSE_RANK" titulo="O que fazer com empates" lead="Swim e P do Pecado têm os mesmos 87 plays. Quem fica em 6º?">
      <div className="prose">
        <p>
          O <code>ROW_NUMBER</code> não aceita empate: ele precisa dar um número diferente para cada linha, então escolhe uma ordem qualquer. Se você rodar de novo, pode
          trocar. Quando o empate importa, existem outras duas funções. <strong>A janela fica igual; só a conta muda.</strong>
        </p>
      </div>
      <Predict
        pergunta="Com RANK, Swim e P do Pecado ficam em 6º. Em que posição fica o Tempo Perdido, logo abaixo delas?"
        opcoes={['7º', '8º', '6º']}
        correta={1}
        explicacao="O RANK pula o 7º, porque duas músicas já ocupam o 6º. É como no pódio olímpico: dois ouros e ninguém leva prata."
      />
      <TieDemo />
      <div className="grid-3">
        <div className="mini">
          <span className="t">ROW_NUMBER</span>
          <span className="big">6, 7, 8</span>
          <p>Nunca repete. Bom quando você precisa de exatamente N linhas.</p>
        </div>
        <div className="mini">
          <span className="t">RANK</span>
          <span className="big">6, 6, 8</span>
          <p>Repete no empate e pula a posição seguinte.</p>
        </div>
        <div className="mini">
          <span className="t">DENSE_RANK</span>
          <span className="big">6, 6, 7</span>
          <p>Repete no empate e não pula nenhuma posição.</p>
        </div>
      </div>
      <div className="callout red">
        <b>Cuidado no MySQL:</b> <code>rank</code>, <code>dense_rank</code> e <code>row_number</code> são palavras reservadas. Não use como nome de coluna; prefira
        nomes como <code>posicao</code> ou <code>pos_rank</code>.
      </div>
      <FillBlank
        pedido="O time de Produto vai dar medalhas no app: quem empata divide a medalha e ninguém pode pular posição. Complete:"
        parts={['SELECT musica, plays,\n       ', { id: 'f', options: FN, answer: 'DENSE_RANK' }, '() OVER (ORDER BY plays DESC) AS medalha\nFROM mais_ouvidas;']}
        explicacao="O DENSE_RANK divide a posição no empate e segue a contagem sem buracos: o Tempo Perdido fica em 7º."
      />
    </Section>
  )
}

export function Partition() {
  return (
    <Section id="partition-by" numero="05 · PARTITION BY" titulo="Um ranking para cada pessoa" lead="A Retrospectiva é individual: a Ana quer o ranking dela, não o geral.">
      <div className="prose">
        <p>
          Agora a função fica parada e quem muda é a janela. O <code>PARTITION BY usuario</code> divide a tabela em pedaços, um por pessoa, e{' '}
          <strong>a conta recomeça em cada pedaço</strong>.
        </p>
        <p>
          Se você conhece o <code>GROUP BY</code>, pense assim: o PARTITION BY divide do mesmo jeito, mas não junta as linhas. As 10 músicas continuam lá.
        </p>
      </div>
      <PartitionDemo />
      <FillBlank
        pedido="Complete para fazer o ranking de cada usuário, do mais ouvido para o menos ouvido:"
        parts={[
          'SELECT usuario, musica, plays,\n       RANK() OVER (',
          { id: 'p', options: ['PARTITION BY', 'GROUP BY', 'ORDER BY'], answer: 'PARTITION BY' },
          ' usuario ',
          { id: 'o', options: ['PARTITION BY', 'GROUP BY', 'ORDER BY'], answer: 'ORDER BY' },
          ' plays DESC) AS posicao\nFROM mais_ouvidas;',
        ]}
        explicacao="Dentro do OVER, primeiro vem o PARTITION BY (em quais grupos) e depois o ORDER BY (em qual ordem). GROUP BY não existe dentro do OVER."
      />
    </Section>
  )
}

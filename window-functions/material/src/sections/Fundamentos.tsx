import { Section } from '../components/layout/Section'
import { GroupVsOver } from '../components/demos/GroupVsOver'
import { Anatomy } from '../components/demos/Anatomy'
import { DataTable } from '../components/ui/DataTable'
import { MAIS_OUVIDAS, ARTISTAS } from '../data/spotify'

export function Inicio() {
  return (
    <header id="inicio" className="hero">
      <span className="eyebrow">Material da aula · SQL</span>
      <h1>
        Window
        <br />
        <span>Functions</span>
      </h1>
      <p className="lead">
        Rankings, totais e comparações sem perder nenhuma linha. Tudo explicado com a Retrospectiva do Spotify, com animações passo a passo e um editor para você testar
        sem instalar nada.
      </p>
      <div className="chips">
        <span className="chip">9 explicações com animação</span>
        <span className="chip">Exercícios de completar</span>
        <span className="chip">Editor de SQL no navegador</span>
        <span className="chip">15 exercícios extras</span>
      </div>
      <div className="callout lime">
        <b>Como usar:</b> leia na ordem e aperte <b>Próximo passo</b> em cada animação. No fim de cada parte há um exercício curto de completar. Quando terminar,
        vá para o <a href="#laboratorio">laboratório</a> e para a <a href="#exercicios">lista extra</a>.
      </div>
    </header>
  )
}

export function Tabela() {
  return (
    <Section id="tabela" numero="00 · O banco" titulo="A tabela que vamos usar" lead="Dois usuários do Spotify e as 5 músicas que cada um mais ouviu no ano.">
      <div className="prose">
        <p>
          Cada linha da tabela <code>mais_ouvidas</code> já é um <strong>total do ano</strong>: a primeira linha diz que o Bruno ouviu Tempo Perdido 61 vezes. Não é uma linha
          por play.
        </p>
        <p>
          Na vida real, essa tabela viria de um <code>GROUP BY</code> sobre milhões de plays. Aqui ela já vem pronta para a gente se concentrar no que interessa: a janela.
        </p>
      </div>
      <DataTable
        caption="mais_ouvidas"
        columns={[
          { key: 'usuario', label: 'usuario', width: 90 },
          { key: 'musica', label: 'musica', width: 250 },
          { key: 'artista', label: 'artista (só para você saber)', width: 290 },
          { key: 'plays', label: 'plays', width: 70, kind: 'num' },
        ]}
        rows={MAIS_OUVIDAS.map((m) => ({ id: m.id, cells: { usuario: m.usuario, musica: m.musica, artista: ARTISTAS[m.musica], plays: m.plays } }))}
      />
    </Section>
  )
}

export function Problema() {
  return (
    <Section id="problema" numero="01 · O problema" titulo="O GROUP BY amassa as linhas" lead="Quero o total de cada pessoa, mas sem perder as músicas.">
      <div className="prose">
        <p>
          O <code>GROUP BY</code> é ótimo para resumir: ele junta as linhas de cada grupo numa linha só. O problema aparece quando você quer o resumo <strong>e</strong> o
          detalhe na mesma tabela, como cada música com o total da pessoa ao lado.
        </p>
        <p>Alterne entre os dois modos e repare no número de linhas:</p>
      </div>
      <GroupVsOver />
      <div className="callout">
        <b>A ideia central:</b> uma window function faz uma conta olhando para um grupo de linhas (a <b>janela</b>), mas devolve o resultado em <b>cada linha</b>, sem
        juntar nada.
      </div>
    </Section>
  )
}

export function Anatomia() {
  return (
    <Section id="anatomia" numero="02 · A sintaxe" titulo="Toda window function tem duas partes" lead="A função diz qual conta fazer. O OVER diz como enxergar a tabela.">
      <div className="prose">
        <p>Toque em cada pedaço da linha abaixo:</p>
      </div>
      <Anatomy />
      <div className="grid-3">
        <div className="mini">
          <span className="t">função()</span>
          <span className="big">Qual conta?</span>
          <p>ROW_NUMBER, RANK, SUM, AVG, LAG…</p>
        </div>
        <div className="mini">
          <span className="t">PARTITION BY</span>
          <span className="big">Em quais grupos?</span>
          <p>Opcional. Sem ele, a tabela inteira é um grupo só.</p>
        </div>
        <div className="mini">
          <span className="t">ORDER BY</span>
          <span className="big">Em qual ordem?</span>
          <p>Necessário para rankings e para o LAG.</p>
        </div>
      </div>
      <p className="lead" style={{ fontSize: 17 }}>
        Daqui para a frente, toda window function vai ser lida assim: <b style={{ color: 'var(--text)' }}>qual conta, em quais grupos, em qual ordem</b>.
      </p>
    </Section>
  )
}

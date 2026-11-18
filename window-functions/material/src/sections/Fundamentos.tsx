import { Section } from '../components/layout/Section'
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
        <span className="chip">8 explicações com animação</span>
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

export function Anatomia() {
  return (
    <Section id="anatomia" numero="02 · A sintaxe" titulo="Toda window function tem duas partes" lead="Antes de seguir, vamos desmontar a linha que acabamos de escrever.">
      <div className="prose">
        <p>
          A <strong>função</strong> diz qual conta fazer em cada linha. O <strong>OVER</strong> diz como a tabela deve ser enxergada enquanto essa conta é feita: essa
          visão da tabela é a <strong>janela</strong>. No ROW_NUMBER que você acabou de ver, a janela era a tabela ordenada por plays.
        </p>
        <p>Toque em cada parte da linha abaixo:</p>
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
      <div className="callout">
        <b>Os dois de dentro são opcionais.</b> Sem PARTITION BY e sem ORDER BY, o OVER fica vazio: <code>OVER ()</code>. Aí a janela é a tabela inteira, de uma vez
        só. Ele vai aparecer na parte 06, com SUM e AVG.
      </div>
      <p className="lead" style={{ fontSize: 17 }}>
        Daqui para a frente, toda window function vai ser lida assim: <b style={{ color: 'var(--text)' }}>qual conta, em quais grupos, em qual ordem</b>. Nas próximas
        partes, a gente mexe em uma peça de cada vez: primeiro troca a função, depois troca a janela.
      </p>
    </Section>
  )
}

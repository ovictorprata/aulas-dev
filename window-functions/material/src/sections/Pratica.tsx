import { Section } from '../components/layout/Section'
import { Lab } from '../components/practice/Lab'
import { ExerciseList } from '../components/practice/ExerciseList'
import { ScriptCard } from '../components/practice/ScriptCard'

const COLA = [
  ['ROW_NUMBER()', 'Numera 1, 2, 3… sem repetir', 'Top N com quantidade fixa, numerar compras'],
  ['RANK()', 'Repete no empate e pula a seguinte', 'Ranking justo, como pódio'],
  ['DENSE_RANK()', 'Repete no empate e não pula', 'Medalhas, faixas sem buracos'],
  ['SUM() / AVG()', 'Conta do grupo em cada linha', 'Total da pessoa, média da loja'],
  ['COUNT() / MAX() / MIN()', 'Mesma ideia de SUM e AVG', 'Quantas vendas no dia'],
  ['LAG()', 'Valor da linha de cima', 'Comparar com o dia ou mês anterior'],
  ['LEAD()', 'Valor da linha de baixo', 'Próxima compra, próximo acesso'],
  ['SUM() OVER (ORDER BY …)', 'Soma do começo até a linha atual', 'Total acumulado'],
]

export function Cola() {
  return (
    <Section id="cola" numero="09 · Resumo" titulo="Cola rápida" lead="Tudo numa tela só, para consultar quando for praticar.">
      <pre className="code">
        <span className="tk-f">FUNÇÃO</span>() <span className="tk-k">OVER</span> (<span className="tk-k">PARTITION BY</span> grupo{' '}
        <span className="tk-k">ORDER BY</span> ordem) <span className="tk-k">AS</span> nome
      </pre>
      <div className="table-wrap">
        <div className="dt">
          <div className="dt-row head" style={{ gridTemplateColumns: '230px 290px 300px' }}>
            <div className="dt-cell">função</div>
            <div className="dt-cell">o que faz</div>
            <div className="dt-cell">quando usar</div>
          </div>
          {COLA.map(([f, o, q]) => (
            <div key={f} className="dt-row" style={{ gridTemplateColumns: '230px 290px 300px' }}>
              <div className="dt-cell mono" style={{ color: 'var(--lime)', fontWeight: 700 }}>{f}</div>
              <div className="dt-cell" style={{ whiteSpace: 'normal' }}>{o}</div>
              <div className="dt-cell" style={{ whiteSpace: 'normal', color: 'var(--muted)' }}>{q}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid-2">
        <div className="callout lime">
          <b>Filtrar pelo resultado?</b> Window function não vai no WHERE. Calcule dentro de um <code>WITH</code> e filtre fora dele.
        </div>
        <div className="callout">
          <b>Sem PARTITION BY</b> a tabela inteira é um grupo só. <b>Sem ORDER BY</b> o SUM e o AVG usam o grupo todo.
        </div>
      </div>
    </Section>
  )
}

export function Workbench() {
  return (
    <Section
      id="workbench"
      numero="10 · Praticar no MySQL"
      titulo="Rodar no Workbench"
      lead="Prefere praticar no MySQL? Rode o script uma vez e o banco fica pronto, com as tabelas e os dados da aula."
    >
      <ol className="passos">
        <li><span>Abra o MySQL Workbench e entre na sua conexão local.</span></li>
        <li><span>Baixe o arquivo do banco ou copie o script, logo abaixo.</span></li>
        <li><span>
          Abra uma aba de consulta (<b>File → New Query Tab</b>) e cole o script. Se baixou o arquivo, use <b>File → Open SQL Script</b>.
        </span></li>
        <li><span>
          Rode tudo de uma vez com <b>Ctrl + Shift + Enter</b>, ou clique no raio.
        </span></li>
        <li><span>Na lista de Schemas, à esquerda, clique em atualizar: o banco aparece lá. O script já deixa o banco selecionado para as próximas consultas.</span></li>
      </ol>
      <div className="callout red">
        <b>O script recomeça do zero:</b> ele apaga o banco com o mesmo nome e cria de novo. Rodar outra vez desfaz qualquer mudança que você fez nas tabelas. Window
        functions precisam do <b>MySQL 8</b> ou mais novo.
      </div>
      <div className="grid-2">
        <ScriptCard banco="spotify" descricao="O banco da aula: as músicas mais ouvidas, os acessos ao app e as novas assinaturas por plano." />
        <ScriptCard banco="loja" descricao="O banco da lista extra: uma rede de lojas com funcionários, clientes, produtos e vendas." />
      </div>
    </Section>
  )
}

export function Laboratorio() {
  return (
    <Section id="laboratorio" numero="11 · Praticar" titulo="Laboratório" lead="Escreva qualquer consulta e veja o resultado. Os dois bancos já estão carregados.">
      <div className="callout">
        Este editor roda um banco <b>SQLite</b> dentro do seu navegador. As window functions funcionam igual ao MySQL 8. Prefere o Workbench? Os scripts estão em{' '}
        <a href="#workbench">Rodar no Workbench</a>.
      </div>
      <Lab />
    </Section>
  )
}

export function Exercicios() {
  return (
    <Section id="exercicios" numero="12 · Lista extra" titulo="Exercícios com outro banco" lead="Uma rede de lojas de acessórios para celular: funcionários, clientes, produtos e vendas.">
      <div className="prose">
        <p>
          Os exercícios vão do mais simples ao mais difícil. O botão <strong>Conferir resposta</strong> roda a sua consulta e compara com o resultado esperado. Não
          precisa usar os mesmos nomes de coluna nem a mesma ordem: o que importa é o resultado.
        </p>
        <p>Tente antes de abrir a dica. A solução fica escondida para quando você travar de vez ou quiser comparar com a sua.</p>
      </div>
      <ExerciseList />
    </Section>
  )
}

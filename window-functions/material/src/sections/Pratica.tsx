import { Section } from '../components/layout/Section'
import { Lab } from '../components/practice/Lab'
import { ExerciseList } from '../components/practice/ExerciseList'

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

export function Laboratorio() {
  return (
    <Section id="laboratorio" numero="10 · Praticar" titulo="Laboratório" lead="Escreva qualquer consulta e veja o resultado. Os dois bancos já estão carregados.">
      <div className="callout">
        Este editor roda um banco <b>SQLite</b> dentro do seu navegador. As window functions funcionam igual ao MySQL 8. Para praticar no Workbench, use o botão{' '}
        <b>Copiar script</b> e cole lá: ele cria o banco e as tabelas.
      </div>
      <Lab />
    </Section>
  )
}

export function Exercicios() {
  return (
    <Section id="exercicios" numero="11 · Lista extra" titulo="Exercícios com outro banco" lead="Uma rede de lojas de acessórios para celular: funcionários, clientes, produtos e vendas.">
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

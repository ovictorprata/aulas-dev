// Lista extra: banco "loja". Cada exercício tem a solução usada na correção automática.

export type Exercicio = {
  id: string
  titulo: string
  enunciado: string
  dica: string
  solucao: string
  /** Comentário mostrado junto com a solução. */
  comentario: string
}

export type Nivel = { nome: string; resumo: string; exercicios: Exercicio[] }

export const NIVEIS: Nivel[] = [
  {
    nome: 'Nível 1 · Contas na janela',
    resumo: 'SUM, AVG e COUNT com OVER, sem perder nenhuma linha.',
    exercicios: [
      {
        id: 'e1',
        titulo: 'Média ao lado',
        enunciado:
          'Liste o nome e o salário de cada funcionário e, numa terceira coluna, a média salarial de toda a rede. Não use GROUP BY: todas as 12 linhas devem continuar aparecendo.',
        dica: 'Uma janela vazia, OVER (), olha para a tabela inteira.',
        solucao: `SELECT nome, salario,
       AVG(salario) OVER () AS media_rede
FROM funcionarios;`,
        comentario: 'Sem PARTITION BY, a janela é a tabela inteira: a mesma média aparece nas 12 linhas.',
      },
      {
        id: 'e2',
        titulo: 'Comparando com a própria loja',
        enunciado:
          'Para cada funcionário, mostre loja_id, salário, a média salarial da loja dele e a diferença entre o salário e essa média.',
        dica: 'A janela agora separa por loja. A diferença é o salário menos a mesma conta da coluna da média.',
        solucao: `SELECT loja_id, salario,
       AVG(salario) OVER (PARTITION BY loja_id) AS media_loja,
       salario - AVG(salario) OVER (PARTITION BY loja_id) AS diferenca
FROM funcionarios;`,
        comentario: 'Diferença positiva: ganha acima da média da loja. Negativa: abaixo.',
      },
      {
        id: 'e3',
        titulo: 'Peso na folha',
        enunciado:
          'Mostre que percentual do total da folha da loja cada salário representa, com 2 casas decimais.',
        dica: 'Divida o salário pelo SUM da loja, multiplique por 100 e use ROUND(..., 2).',
        solucao: `SELECT nome, loja_id, salario,
       ROUND(salario * 100 / SUM(salario) OVER (PARTITION BY loja_id), 2) AS pct_folha
FROM funcionarios;`,
        comentario: 'Somando a coluna pct_folha de uma loja, o resultado é 100.',
      },
      {
        id: 'e4',
        titulo: 'O dia da loja',
        enunciado:
          'Para cada venda, mostre id, data_venda, loja_id, valor_total, o total vendido pela mesma loja naquele dia e quantas vendas a loja fez naquele dia.',
        dica: 'A janela pode separar por mais de uma coluna: PARTITION BY loja_id, data_venda.',
        solucao: `SELECT id, data_venda, loja_id, valor_total,
       SUM(valor_total) OVER (PARTITION BY loja_id, data_venda) AS total_dia,
       COUNT(*) OVER (PARTITION BY loja_id, data_venda) AS vendas_dia
FROM vendas;`,
        comentario: 'Cada pedaço da janela é uma combinação de loja e dia.',
      },
    ],
  },
  {
    nome: 'Nível 2 · Rankings',
    resumo: 'ROW_NUMBER, RANK e DENSE_RANK, com e sem PARTITION BY.',
    exercicios: [
      {
        id: 'e5',
        titulo: 'Numerando as compras',
        enunciado:
          'Numere as compras de cada cliente em ordem cronológica (1ª, 2ª, 3ª…). Se duas compras forem no mesmo dia, desempate pelo id da venda.',
        dica: 'Separe por cliente_id e ordene por duas colunas: data_venda, id.',
        solucao: `SELECT cliente_id, id, data_venda,
       ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data_venda, id) AS n_compra
FROM vendas;`,
        comentario: 'O Rafael (cliente 4) comprou duas vezes em 05/09: o id decide quem é a 2ª e quem é a 3ª.',
      },
      {
        id: 'e6',
        titulo: 'ROW_NUMBER × RANK × DENSE_RANK',
        enunciado:
          'Ordene os funcionários do maior para o menor salário e mostre as três funções lado a lado. Depois responda: por que as colunas ficam diferentes nos salários de R$ 3.200 e R$ 2.400?',
        dica: 'Três colunas, a mesma janela: OVER (ORDER BY salario DESC). Não use rank como nome de coluna, que é palavra reservada no MySQL.',
        solucao: `SELECT nome, salario,
       ROW_NUMBER() OVER (ORDER BY salario DESC) AS pos_row,
       RANK()       OVER (ORDER BY salario DESC) AS pos_rank,
       DENSE_RANK() OVER (ORDER BY salario DESC) AS pos_dense
FROM funcionarios;`,
        comentario:
          'Três pessoas ganham R$ 3.200 e três ganham R$ 2.400. O ROW_NUMBER dá números diferentes a quem empatou; o RANK repete o número e pula os seguintes; o DENSE_RANK repete e não pula.',
      },
      {
        id: 'e7',
        titulo: 'Ranking dentro da loja',
        enunciado: 'Faça o ranking salarial dentro de cada loja, sem pular posições em caso de empate.',
        dica: 'Não pular posição é o DENSE_RANK. Dentro de cada loja é o PARTITION BY.',
        solucao: `SELECT loja_id, nome, salario,
       DENSE_RANK() OVER (PARTITION BY loja_id ORDER BY salario DESC) AS posicao
FROM funcionarios;`,
        comentario: 'Na Loja Paulista, Bruno e Carla empatam em 2º e o Diego fica em 3º.',
      },
      {
        id: 'e8',
        titulo: 'Top 2 por loja',
        enunciado:
          'Liste os 2 maiores salários de cada loja. Se houver empate na 2ª posição, todos os empatados devem aparecer.',
        dica: 'Calcule o ranking dentro de um WITH e filtre fora dele. Qual função deixa os empatados com a mesma posição?',
        solucao: `WITH ranking AS (
  SELECT loja_id, nome, salario,
         RANK() OVER (PARTITION BY loja_id ORDER BY salario DESC) AS posicao
  FROM funcionarios
)
SELECT * FROM ranking
WHERE posicao <= 2;`,
        comentario: 'A Loja Paulista aparece com 3 pessoas por causa do empate em 2º lugar.',
      },
      {
        id: 'e9',
        titulo: 'Primeira compra',
        enunciado: 'Para cada cliente, mostre o nome, a data, o nome do produto e o valor da primeira compra.',
        dica: 'Numere as compras como no exercício 5 dentro de um WITH, junte com clientes e produtos e filtre a compra número 1.',
        solucao: `WITH compras AS (
  SELECT cliente_id, produto_id, data_venda, valor_total,
         ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data_venda, id) AS n_compra
  FROM vendas
)
SELECT c.nome, co.data_venda, p.nome AS produto, co.valor_total
FROM compras co
JOIN clientes c ON c.id = co.cliente_id
JOIN produtos p ON p.id = co.produto_id
WHERE co.n_compra = 1;`,
        comentario: 'O padrão "numerar e filtrar o número 1" serve para pegar a primeira ou a última coisa de cada grupo.',
      },
    ],
  },
  {
    nome: 'Nível 3 · Linha de cima e linha de baixo',
    resumo: 'LAG e LEAD para comparar uma linha com a vizinha.',
    exercicios: [
      {
        id: 'e10',
        titulo: 'Compra anterior',
        enunciado:
          'Para cada venda, mostre cliente_id, data_venda, valor_total e o valor da compra anterior do mesmo cliente.',
        dica: 'LAG(valor_total) com a janela por cliente, em ordem de data_venda e id.',
        solucao: `SELECT cliente_id, data_venda, valor_total,
       LAG(valor_total) OVER (PARTITION BY cliente_id ORDER BY data_venda, id) AS valor_anterior
FROM vendas;`,
        comentario: 'A primeira compra de cada cliente vem com NULL: não existe compra antes dela.',
      },
      {
        id: 'e11',
        titulo: 'Gastou mais ou menos?',
        enunciado:
          'Para cada venda, mostre cliente_id, data_venda, valor_total e a diferença entre o valor desta compra e o da compra anterior do mesmo cliente.',
        dica: 'É o exercício anterior com uma subtração: valor_total - LAG(...).',
        solucao: `SELECT cliente_id, data_venda, valor_total,
       valor_total - LAG(valor_total) OVER (PARTITION BY cliente_id ORDER BY data_venda, id) AS diferenca
FROM vendas;`,
        comentario: 'Positivo: gastou mais que na compra anterior. Negativo: gastou menos.',
      },
      {
        id: 'e12',
        titulo: 'Próxima visita',
        enunciado: 'Para cada venda, mostre cliente_id, data_venda e a data da próxima compra do mesmo cliente.',
        dica: 'O LEAD é o contrário do LAG: pega a linha de baixo.',
        solucao: `SELECT cliente_id, data_venda,
       LEAD(data_venda) OVER (PARTITION BY cliente_id ORDER BY data_venda, id) AS proxima_compra
FROM vendas;`,
        comentario: 'A última compra de cada cliente vem com NULL: ainda não houve uma próxima.',
      },
    ],
  },
  {
    nome: 'Nível 4 · Desafios',
    resumo: 'Juntando tudo: GROUP BY, WITH e window functions na mesma consulta.',
    exercicios: [
      {
        id: 'e13',
        titulo: 'Faturamento acumulado',
        enunciado:
          'Para cada venda, mostre id, loja_id, data_venda, valor_total e o total acumulado da loja até aquela venda, em ordem de data e id.',
        dica: 'Um SUM com ORDER BY dentro do OVER soma "do começo até aqui".',
        solucao: `SELECT id, loja_id, data_venda, valor_total,
       SUM(valor_total) OVER (PARTITION BY loja_id ORDER BY data_venda, id) AS acumulado
FROM vendas;`,
        comentario: 'A última venda de cada loja mostra o faturamento total dela no período.',
      },
      {
        id: 'e14',
        titulo: 'Produto campeão de cada loja',
        enunciado:
          'Descubra o produto com maior faturamento em cada loja. Mostre loja_id, o nome do produto e o total faturado com ele.',
        dica: 'Primeiro some por loja e produto com GROUP BY dentro de um WITH. Depois faça o ranking dentro da loja e filtre a posição 1.',
        solucao: `WITH por_produto AS (
  SELECT v.loja_id, p.nome AS produto, SUM(v.valor_total) AS total
  FROM vendas v
  JOIN produtos p ON p.id = v.produto_id
  GROUP BY v.loja_id, p.nome
),
ranking AS (
  SELECT loja_id, produto, total,
         RANK() OVER (PARTITION BY loja_id ORDER BY total DESC) AS posicao
  FROM por_produto
)
SELECT loja_id, produto, total
FROM ranking
WHERE posicao = 1;`,
        comentario: 'É o caso mais comum no trabalho: o GROUP BY resume, a window function ranqueia o resumo.',
      },
      {
        id: 'e15',
        titulo: 'Melhor dia de cada loja',
        enunciado: 'Mostre, para cada loja, o dia de maior faturamento e quanto ela vendeu nesse dia.',
        dica: 'Mesma receita do desafio anterior, agrupando por loja e data.',
        solucao: `WITH por_dia AS (
  SELECT loja_id, data_venda, SUM(valor_total) AS total
  FROM vendas
  GROUP BY loja_id, data_venda
),
ranking AS (
  SELECT loja_id, data_venda, total,
         RANK() OVER (PARTITION BY loja_id ORDER BY total DESC) AS posicao
  FROM por_dia
)
SELECT loja_id, data_venda, total
FROM ranking
WHERE posicao = 1;`,
        comentario: 'Trocando DESC por ASC, a mesma consulta mostra o pior dia de cada loja.',
      },
    ],
  },
]

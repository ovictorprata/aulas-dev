// Lista extra: banco "loja". Segue a mesma ordem da aula, um passo de cada vez.
// Cada nível abre com um exemplo resolvido em outro contexto, depois vêm exercícios parecidos
// com ele (com a consulta começada) e só no fim exercícios por conta do aluno.
// WITH (CTE) só aparece no último nível.

import type { Exemplo } from './usos'

export type Exercicio = {
  id: string
  /** guiado: parecido com o exemplo, já vem com a consulta começada. solto: por conta do aluno. */
  tipo: 'guiado' | 'solto'
  titulo: string
  enunciado: string
  /** Consulta que já aparece no editor. O aluno troca o ___. */
  inicio?: string
  dica: string
  solucao: string
  /** Comentário mostrado junto com a solução. */
  comentario: string
}

export type Nivel = { nome: string; menu: string; resumo: string; exemplo: Exemplo; exercicios: Exercicio[] }

export const NIVEIS: Nivel[] = [
  {
    nome: 'Nível 1 · Numerando com ROW_NUMBER',
    menu: 'Numerando',
    resumo: 'O primeiro OVER: a função ROW_NUMBER com um ORDER BY dentro.',
    exemplo: {
      area: 'Escola',
      pergunta: 'Numerar os alunos da maior para a menor nota.',
      sql: `SELECT aluno, nota,
       ROW_NUMBER() OVER (ORDER BY nota DESC) AS posicao
FROM notas;`,
      colunas: ['aluno', 'nota', 'posicao'],
      linhas: [
        ['Rita', 9.5, 1],
        ['Caio', 8.5, 2],
        ['Nina', 7.5, 3],
        ['Davi', 5.5, 4],
      ],
      destaque: 'posicao',
      conclusao: 'O ORDER BY dentro do OVER diz em que ordem numerar. Com DESC, o 1 vai para a maior nota.',
    },
    exercicios: [
      {
        id: 'n1',
        tipo: 'guiado',
        titulo: 'Do mais caro ao mais barato',
        enunciado: 'Igual ao exemplo, mas com os produtos: numere do mais caro para o mais barato. Mostre o nome, o preço e a posição.',
        inicio: `SELECT nome, preco,
       ___ AS posicao
FROM produtos;`,
        dica: 'Copie a linha do ROW_NUMBER do exemplo e troque nota por preco.',
        solucao: `SELECT nome, preco,
       ROW_NUMBER() OVER (ORDER BY preco DESC) AS posicao
FROM produtos;`,
        comentario: 'O Smartwatch, de R$ 899, fica com o 1.',
      },
      {
        id: 'n2',
        tipo: 'guiado',
        titulo: 'Agora do mais barato',
        enunciado: 'A mesma lista, mas agora o 1 tem que ir para o produto mais barato.',
        inicio: `SELECT nome, preco,
       ROW_NUMBER() OVER (ORDER BY preco ___) AS posicao
FROM produtos;`,
        dica: 'Do menor para o maior é ASC. (Sem nada, o ORDER BY também já é ASC.)',
        solucao: `SELECT nome, preco,
       ROW_NUMBER() OVER (ORDER BY preco ASC) AS posicao
FROM produtos;`,
        comentario: 'Só a palavra depois do ORDER BY mudou. A Capa de Celular, de R$ 49,90, agora é a 1ª.',
      },
      {
        id: 'n3',
        tipo: 'solto',
        titulo: 'Lista de chamada',
        enunciado: 'Numere os funcionários em ordem alfabética do nome, como numa lista de chamada. Mostre o nome e o número.',
        dica: 'Ordem alfabética é ordenar pelo nome, do A ao Z.',
        solucao: `SELECT nome,
       ROW_NUMBER() OVER (ORDER BY nome) AS numero
FROM funcionarios;`,
        comentario: 'O ORDER BY não precisa ser de número: texto ordena em ordem alfabética.',
      },
    ],
  },
  {
    nome: 'Nível 2 · Empates: RANK e DENSE_RANK',
    menu: 'Empates',
    resumo: 'Trocando a função: o que acontece quando dois valores são iguais.',
    exemplo: {
      area: 'Games',
      pergunta: 'Montar o placar de um campeonato em que dois jogadores empataram.',
      sql: `SELECT jogador, pontos,
       RANK()       OVER (ORDER BY pontos DESC) AS pos_rank,
       DENSE_RANK() OVER (ORDER BY pontos DESC) AS pos_dense
FROM placar;`,
      colunas: ['jogador', 'pontos', 'pos_rank', 'pos_dense'],
      linhas: [
        ['Lia', 300, 1, 1],
        ['Téo', 300, 1, 1],
        ['Gui', 250, 3, 2],
        ['Mel', 200, 4, 3],
      ],
      destaque: 'pos_rank',
      conclusao: 'Os dois dão o 1º lugar para quem empatou. Depois, o RANK pula para o 3º e o DENSE_RANK segue para o 2º.',
    },
    exercicios: [
      {
        id: 'n4',
        tipo: 'guiado',
        titulo: 'Ranking de salários',
        enunciado: 'Faça o ranking dos funcionários do maior para o menor salário, usando RANK. Mostre o nome, o salário e a posição.',
        inicio: `SELECT nome, salario,
       ___ OVER (ORDER BY salario DESC) AS posicao
FROM funcionarios;`,
        dica: 'A janela já está pronta. Falta só a função: RANK().',
        solucao: `SELECT nome, salario,
       RANK() OVER (ORDER BY salario DESC) AS posicao
FROM funcionarios;`,
        comentario: 'Três pessoas ganham R$ 3.200 e dividem o 5º lugar. Por isso ninguém fica em 6º nem em 7º.',
      },
      {
        id: 'n5',
        tipo: 'guiado',
        titulo: 'Sem pular posição',
        enunciado: 'O mesmo ranking, mas sem pular nenhuma posição depois dos empates.',
        inicio: `SELECT nome, salario,
       ___ OVER (ORDER BY salario DESC) AS posicao
FROM funcionarios;`,
        dica: 'Qual das duas funções do exemplo não pula número?',
        solucao: `SELECT nome, salario,
       DENSE_RANK() OVER (ORDER BY salario DESC) AS posicao
FROM funcionarios;`,
        comentario: 'Depois dos três empatados em 5º, o próximo salário fica em 6º.',
      },
      {
        id: 'n6',
        tipo: 'solto',
        titulo: 'Do menor salário para o maior',
        enunciado: 'Faça um ranking em que o menor salário fica em 1º, sem pular posições nos empates.',
        dica: 'Junte as duas coisas que você já treinou: a função que não pula e a ordem do menor para o maior.',
        solucao: `SELECT nome, salario,
       DENSE_RANK() OVER (ORDER BY salario ASC) AS posicao
FROM funcionarios;`,
        comentario: 'A Larissa, com R$ 2.000, fica em 1º. Os três caixas de R$ 2.400 empatam em 3º.',
      },
    ],
  },
  {
    nome: 'Nível 3 · Um ranking por grupo: PARTITION BY',
    menu: 'Por grupo',
    resumo: 'Trocando a janela: a contagem recomeça em cada grupo.',
    exemplo: {
      area: 'Escola',
      pergunta: 'Ranking das notas dentro de cada turma.',
      sql: `SELECT turma, aluno, nota,
       RANK() OVER (PARTITION BY turma ORDER BY nota DESC) AS pos_turma
FROM notas;`,
      colunas: ['turma', 'aluno', 'nota', 'pos_turma'],
      linhas: [
        ['A', 'Rita', 9.5, 1],
        ['A', 'Caio', 8.5, 2],
        ['B', 'Nina', 8.5, 1],
        ['B', 'Davi', 5.5, 2],
      ],
      destaque: 'pos_turma',
      conclusao: 'O PARTITION BY separa as turmas, e a posição recomeça do 1 em cada uma.',
    },
    exercicios: [
      {
        id: 'n7',
        tipo: 'guiado',
        titulo: 'Ranking dentro de cada loja',
        enunciado: 'Faça o ranking de salários dentro de cada loja, com RANK. Mostre loja_id, nome, salário e a posição.',
        inicio: `SELECT loja_id, nome, salario,
       RANK() OVER (PARTITION BY ___ ORDER BY salario DESC) AS posicao
FROM funcionarios;`,
        dica: 'Cada loja é um grupo. Qual coluna diz a loja do funcionário?',
        solucao: `SELECT loja_id, nome, salario,
       RANK() OVER (PARTITION BY loja_id ORDER BY salario DESC) AS posicao
FROM funcionarios;`,
        comentario: 'Cada loja tem o seu 1º lugar: o gerente. Na loja 1, Bruno e Carla empatam em 2º.',
      },
      {
        id: 'n8',
        tipo: 'guiado',
        titulo: 'O mais caro de cada categoria',
        enunciado: 'Numere os produtos dentro de cada categoria, do mais caro para o mais barato. Mostre categoria, nome, preço e o número.',
        inicio: `SELECT categoria, nome, preco,
       ROW_NUMBER() OVER (___) AS posicao
FROM produtos;`,
        dica: 'Dentro do OVER vão as duas partes: primeiro o PARTITION BY categoria, depois o ORDER BY preco DESC.',
        solucao: `SELECT categoria, nome, preco,
       ROW_NUMBER() OVER (PARTITION BY categoria ORDER BY preco DESC) AS posicao
FROM produtos;`,
        comentario: 'Em Áudio, a Caixa de Som é a 1ª. Em Energia, o Power Bank.',
      },
      {
        id: 'n9',
        tipo: 'solto',
        titulo: 'Compras de cada cliente',
        enunciado:
          'Numere as compras de cada cliente da mais antiga para a mais recente (1ª compra, 2ª compra…). Mostre cliente_id, id da venda, data_venda e o número. Se duas compras forem no mesmo dia, desempate pelo id da venda.',
        dica: 'O grupo é o cliente. Para desempatar, o ORDER BY aceita duas colunas: ORDER BY data_venda, id.',
        solucao: `SELECT cliente_id, id, data_venda,
       ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data_venda, id) AS n_compra
FROM vendas;`,
        comentario: 'O Rafael (cliente 4) comprou duas vezes em 05/09: o id decide quem é a 2ª e quem é a 3ª.',
      },
    ],
  },
  {
    nome: 'Nível 4 · Mostrando a soma e a média',
    menu: 'Soma e média',
    resumo: 'SUM e AVG com OVER: primeiro com o OVER vazio, depois por grupo.',
    exemplo: {
      area: 'Academia',
      pergunta: 'Mostrar cada mensalidade ao lado do total e da média de todas.',
      sql: `SELECT aluno, mensalidade,
       SUM(mensalidade) OVER () AS total,
       AVG(mensalidade) OVER () AS media
FROM matriculas;`,
      colunas: ['aluno', 'mensalidade', 'total', 'media'],
      linhas: [
        ['Bia', 100, 360, 120],
        ['Beto', 120, 360, 120],
        ['Cris', 140, 360, 120],
      ],
      destaque: 'total',
      conclusao: 'O OVER pode ficar vazio: OVER (). Aí a janela é a tabela inteira, e o mesmo total e a mesma média aparecem em todas as linhas.',
    },
    exercicios: [
      {
        id: 'n10',
        tipo: 'guiado',
        titulo: 'Total da folha',
        enunciado: 'Mostre o nome e o salário de cada funcionário e, ao lado, o total de todos os salários somados.',
        inicio: `SELECT nome, salario,
       ___ OVER () AS total_folha
FROM funcionarios;`,
        dica: 'Somar é SUM. Dentro dos parênteses vai a coluna que você quer somar.',
        solucao: `SELECT nome, salario,
       SUM(salario) OVER () AS total_folha
FROM funcionarios;`,
        comentario: 'As 12 linhas continuam lá, todas com o mesmo total: R$ 36.900.',
      },
      {
        id: 'n11',
        tipo: 'guiado',
        titulo: 'Média da rede',
        enunciado: 'Agora, ao lado de cada salário, mostre a média salarial de toda a rede.',
        inicio: `SELECT nome, salario,
       ___ AS media_rede
FROM funcionarios;`,
        dica: 'É o exercício anterior trocando SUM por AVG.',
        solucao: `SELECT nome, salario,
       AVG(salario) OVER () AS media_rede
FROM funcionarios;`,
        comentario: 'A média da rede é R$ 3.075, repetida nas 12 linhas.',
      },
      {
        id: 'n12',
        tipo: 'solto',
        titulo: 'Média de cada loja',
        enunciado: 'Mostre nome, loja_id e salário de cada funcionário e, ao lado, a média salarial da loja dele (não da rede toda).',
        dica: 'Para a conta ser de cada loja, a janela não pode ficar vazia: separe por loja.',
        solucao: `SELECT nome, loja_id, salario,
       AVG(salario) OVER (PARTITION BY loja_id) AS media_loja
FROM funcionarios;`,
        comentario: 'Cada loja tem a sua média: R$ 3.325 na loja 1, R$ 3.050 na loja 2 e R$ 2.850 na loja 3.',
      },
      {
        id: 'n13',
        tipo: 'solto',
        titulo: 'Tamanho da equipe',
        enunciado: 'Ao lado de cada funcionário, mostre quantas pessoas trabalham na loja dele.',
        dica: 'Contar linhas é COUNT(*). A janela é a mesma do exercício anterior.',
        solucao: `SELECT nome, loja_id,
       COUNT(*) OVER (PARTITION BY loja_id) AS pessoas_na_loja
FROM funcionarios;`,
        comentario: 'Cada loja tem 4 funcionários, então o 4 aparece em todas as linhas.',
      },
    ],
  },
  {
    nome: 'Nível 5 · Comparando com o grupo',
    menu: 'Comparar',
    resumo: 'Usar a média ou o maior valor do grupo numa conta com a própria linha.',
    exemplo: {
      area: 'Escola',
      pergunta: 'Quanto cada aluno está acima ou abaixo da média da turma?',
      sql: `SELECT turma, aluno, nota,
       nota - AVG(nota) OVER (PARTITION BY turma) AS dif_media
FROM notas;`,
      colunas: ['turma', 'aluno', 'nota', 'dif_media'],
      linhas: [
        ['A', 'Rita', 9.5, 0.5],
        ['A', 'Caio', 8.5, -0.5],
        ['B', 'Nina', 8.5, 1.5],
        ['B', 'Davi', 5.5, -1.5],
      ],
      destaque: 'dif_media',
      conclusao: 'A média da turma A é 9. A Rita, com 9,5, está 0,5 acima dela. Positivo: acima da média; negativo: abaixo.',
    },
    exercicios: [
      {
        id: 'n14',
        tipo: 'guiado',
        titulo: 'Acima ou abaixo da média da loja',
        enunciado: 'Para cada funcionário, mostre nome, loja_id, salário e quanto ele ganha acima ou abaixo da média da loja dele.',
        inicio: `SELECT nome, loja_id, salario,
       salario - ___ AS dif_media
FROM funcionarios;`,
        dica: 'No lugar do ___ vai a média da loja, que você montou no nível anterior.',
        solucao: `SELECT nome, loja_id, salario,
       salario - AVG(salario) OVER (PARTITION BY loja_id) AS dif_media
FROM funcionarios;`,
        comentario: 'O Diego ganha R$ 925 abaixo da média da loja 1.',
      },
      {
        id: 'n15',
        tipo: 'guiado',
        titulo: 'Quanto falta para o maior salário',
        enunciado: 'Para cada funcionário, mostre quanto falta para ele chegar ao maior salário da loja dele.',
        inicio: `SELECT nome, loja_id, salario,
       ___ - salario AS falta
FROM funcionarios;`,
        dica: 'O maior valor é MAX. Use MAX(salario) com a mesma janela por loja.',
        solucao: `SELECT nome, loja_id, salario,
       MAX(salario) OVER (PARTITION BY loja_id) - salario AS falta
FROM funcionarios;`,
        comentario: 'Para os gerentes a conta dá 0: eles já são o maior salário da loja.',
      },
      {
        id: 'n16',
        tipo: 'solto',
        titulo: 'O dia da loja',
        enunciado:
          'Para cada venda, mostre id, data_venda, loja_id e valor_total e, ao lado, o total vendido pela mesma loja naquele dia.',
        dica: 'A janela pode separar por duas colunas ao mesmo tempo: PARTITION BY loja_id, data_venda.',
        solucao: `SELECT id, data_venda, loja_id, valor_total,
       SUM(valor_total) OVER (PARTITION BY loja_id, data_venda) AS total_dia
FROM vendas;`,
        comentario: 'Cada grupo da janela é uma combinação de loja e dia.',
      },
    ],
  },
  {
    nome: 'Nível 6 · Linha de cima e linha de baixo: LAG e LEAD',
    menu: 'LAG e LEAD',
    resumo: 'Trazer para a linha atual um valor da linha anterior ou da próxima.',
    exemplo: {
      area: 'Redes sociais',
      pergunta: 'Quantos seguidores o perfil tinha no mês anterior?',
      sql: `SELECT mes, seguidores,
       LAG(seguidores) OVER (ORDER BY mes) AS mes_anterior
FROM seguidores;`,
      colunas: ['mes', 'seguidores', 'mes_anterior'],
      linhas: [
        ['2026-01', 1000, null],
        ['2026-02', 1200, 1000],
        ['2026-03', 1150, 1200],
      ],
      destaque: 'mes_anterior',
      conclusao: 'O LAG pega o valor da linha de cima, na ordem do ORDER BY. Janeiro não tem ninguém antes, então recebe NULL.',
    },
    exercicios: [
      {
        id: 'n17',
        tipo: 'guiado',
        titulo: 'Venda anterior',
        enunciado: 'Em ordem de id, mostre o id e o valor_total de cada venda e, ao lado, o valor da venda anterior.',
        inicio: `SELECT id, valor_total,
       ___ OVER (ORDER BY id) AS valor_anterior
FROM vendas;`,
        dica: 'Copie o LAG do exemplo, trocando seguidores por valor_total.',
        solucao: `SELECT id, valor_total,
       LAG(valor_total) OVER (ORDER BY id) AS valor_anterior
FROM vendas;`,
        comentario: 'A venda 1 recebe NULL: não existe venda antes dela.',
      },
      {
        id: 'n18',
        tipo: 'guiado',
        titulo: 'Próxima venda',
        enunciado: 'Agora, ao lado de cada venda, mostre o valor da próxima.',
        inicio: `SELECT id, valor_total,
       ___ OVER (ORDER BY id) AS proximo_valor
FROM vendas;`,
        dica: 'O contrário do LAG é o LEAD: ele pega a linha de baixo.',
        solucao: `SELECT id, valor_total,
       LEAD(valor_total) OVER (ORDER BY id) AS proximo_valor
FROM vendas;`,
        comentario: 'Agora quem recebe NULL é a última venda, a 20: não existe próxima.',
      },
      {
        id: 'n19',
        tipo: 'solto',
        titulo: 'Compra anterior do mesmo cliente',
        enunciado:
          'Para cada venda, mostre cliente_id, data_venda, valor_total e o valor da compra anterior do mesmo cliente. Desempate as compras do mesmo dia pelo id.',
        dica: 'É o LAG com um PARTITION BY cliente_id, em ordem de data_venda e id.',
        solucao: `SELECT cliente_id, data_venda, valor_total,
       LAG(valor_total) OVER (PARTITION BY cliente_id ORDER BY data_venda, id) AS valor_anterior
FROM vendas;`,
        comentario: 'Agora o NULL aparece na primeira compra de cada cliente, porque a contagem recomeça em cada um.',
      },
      {
        id: 'n20',
        tipo: 'solto',
        titulo: 'Gastou mais ou menos?',
        enunciado: 'Ao lado de cada venda, mostre a diferença entre o valor dela e o da compra anterior do mesmo cliente.',
        dica: 'É o exercício anterior com uma subtração: valor_total - LAG(...).',
        solucao: `SELECT cliente_id, data_venda, valor_total,
       valor_total - LAG(valor_total) OVER (PARTITION BY cliente_id ORDER BY data_venda, id) AS diferenca
FROM vendas;`,
        comentario: 'Positivo: gastou mais que na compra anterior. Negativo: gastou menos.',
      },
    ],
  },
  {
    nome: 'Nível 7 · Desafios com WITH',
    menu: 'Desafios',
    resumo: 'Para quem terminou tudo: calcular a window function num WITH e filtrar o resultado.',
    exemplo: {
      area: 'Escola',
      pergunta: 'Só o 1º lugar de cada turma.',
      sql: `WITH ranking AS (
  SELECT turma, aluno, nota,
         RANK() OVER (PARTITION BY turma ORDER BY nota DESC) AS pos_turma
  FROM notas
)
SELECT * FROM ranking
WHERE pos_turma = 1;`,
      colunas: ['turma', 'aluno', 'nota', 'pos_turma'],
      linhas: [
        ['A', 'Rita', 9.5, 1],
        ['B', 'Nina', 8.5, 1],
      ],
      destaque: 'pos_turma',
      conclusao:
        'O WHERE roda antes da window function, então não dá para filtrar a posição direto. O WITH calcula o ranking primeiro e dá um nome para ele; depois a consulta de baixo filtra como se fosse uma tabela.',
    },
    exercicios: [
      {
        id: 'n21',
        tipo: 'guiado',
        titulo: 'Top 2 por loja',
        enunciado: 'Liste os 2 maiores salários de cada loja. Se houver empate, todos os empatados devem aparecer.',
        inicio: `WITH ranking AS (
  SELECT loja_id, nome, salario,
         RANK() OVER (PARTITION BY loja_id ORDER BY salario DESC) AS posicao
  FROM funcionarios
)
SELECT * FROM ranking
WHERE ___;`,
        dica: 'O ranking já está pronto no WITH. Falta o filtro: as duas primeiras posições.',
        solucao: `WITH ranking AS (
  SELECT loja_id, nome, salario,
         RANK() OVER (PARTITION BY loja_id ORDER BY salario DESC) AS posicao
  FROM funcionarios
)
SELECT * FROM ranking
WHERE posicao <= 2;`,
        comentario: 'A loja 1 aparece com 3 pessoas por causa do empate em 2º lugar.',
      },
      {
        id: 'n22',
        tipo: 'solto',
        titulo: 'Primeira compra de cada cliente',
        enunciado: 'Mostre só a primeira compra de cada cliente: cliente_id, data_venda e valor_total.',
        dica: 'Numere as compras como no exercício 9 dentro de um WITH e filtre o número 1.',
        solucao: `WITH compras AS (
  SELECT cliente_id, data_venda, valor_total,
         ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data_venda, id) AS n_compra
  FROM vendas
)
SELECT cliente_id, data_venda, valor_total
FROM compras
WHERE n_compra = 1;`,
        comentario: 'O padrão "numerar e filtrar o número 1" serve para pegar a primeira ou a última coisa de cada grupo.',
      },
      {
        id: 'n23',
        tipo: 'solto',
        titulo: 'Faturamento acumulado',
        enunciado:
          'Para cada venda, mostre id, loja_id, data_venda, valor_total e o total que a loja já tinha vendido até aquela venda, em ordem de data e id.',
        dica: 'Um SUM com ORDER BY dentro do OVER soma "do começo até aqui". Não precisa de WITH.',
        solucao: `SELECT id, loja_id, data_venda, valor_total,
       SUM(valor_total) OVER (PARTITION BY loja_id ORDER BY data_venda, id) AS acumulado
FROM vendas;`,
        comentario: 'A última venda de cada loja mostra o faturamento total dela no período.',
      },
      {
        id: 'n24',
        tipo: 'solto',
        titulo: 'Produto campeão de cada loja',
        enunciado: 'Descubra o produto com maior faturamento em cada loja. Mostre loja_id, o nome do produto e o total faturado com ele.',
        dica: 'Dois WITH: no primeiro, some por loja e produto com GROUP BY. No segundo, faça o ranking dentro da loja. No fim, filtre a posição 1.',
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
    ],
  },
]

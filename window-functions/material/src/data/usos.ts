// "Na prática": o que cada função faz, um exemplo de negócio pequeno e onde ela aparece no trabalho.
// Os exemplos usam tabelas inventadas de propósito (pedidos, vendedores…) para mostrar a função fora do Spotify.

export type Exemplo = {
  area: string
  pergunta: string
  sql: string
  colunas: string[]
  linhas: (string | number | null)[][]
  /** Coluna calculada pela window function, destacada na tabela. */
  destaque: string
  conclusao: string
}

export type Uso = {
  funcao: string
  oQueFaz: string
  exemplo: Exemplo
  onde: { area: string; texto: string }[]
}

export const USOS: Record<string, Uso> = {
  ROW_NUMBER: {
    funcao: 'ROW_NUMBER()',
    oQueFaz: 'Dá um número para cada linha (1, 2, 3…) na ordem pedida dentro do OVER. Nunca repete número, nem quando duas linhas empatam.',
    exemplo: {
      area: 'E-commerce',
      pergunta: 'Qual foi a 1ª, a 2ª e a 3ª compra da cliente Júlia?',
      sql: `SELECT pedido, data_pedido,
       ROW_NUMBER() OVER (ORDER BY data_pedido) AS compra_n
FROM pedidos
WHERE cliente = 'Júlia';`,
      colunas: ['pedido', 'data_pedido', 'compra_n'],
      linhas: [
        ['#1021', '2026-02-03', 1],
        ['#1180', '2026-03-15', 2],
        ['#1302', '2026-04-28', 3],
      ],
      destaque: 'compra_n',
      conclusao: 'Com o número na linha, fica fácil achar a primeira compra (para o e-mail de boas-vindas) ou a terceira (que libera o frete grátis).',
    },
    onde: [
      { area: 'E-commerce', texto: 'Achar a primeira ou a última compra de cada cliente: numera e fica com o 1.' },
      { area: 'Dados', texto: 'Limpar linhas duplicadas: numera as repetidas e mantém só a de número 1.' },
      { area: 'Produto', texto: 'Mostrar exatamente 10 itens numa vitrine, mesmo que alguns empatem em vendas.' },
    ],
  },
  RANK: {
    funcao: 'RANK()',
    oQueFaz: 'Dá a posição de cada linha. Quem empata divide a posição, e a posição seguinte é pulada, como num pódio: dois em 1º, o próximo é 3º.',
    exemplo: {
      area: 'Vendas',
      pergunta: 'Quem ficou em cada posição no ranking de vendedores do mês?',
      sql: `SELECT vendedor, vendas,
       RANK() OVER (ORDER BY vendas DESC) AS posicao
FROM vendas_do_mes;`,
      colunas: ['vendedor', 'vendas', 'posicao'],
      linhas: [
        ['Carla', 52, 1],
        ['Diego', 52, 1],
        ['Elisa', 47, 3],
        ['Fábio', 30, 4],
      ],
      destaque: 'posicao',
      conclusao: 'Carla e Diego dividem o 1º lugar. A Elisa é a 3ª, porque duas pessoas venderam mais que ela.',
    },
    onde: [
      { area: 'Vendas', texto: 'Premiar os melhores vendedores do mês sem prejudicar quem empatou.' },
      { area: 'Games e apps', texto: 'Placar de pontos dos jogadores (o famoso leaderboard).' },
      { area: 'Competições', texto: 'Classificação de campeonato, hackathon ou processo seletivo.' },
    ],
  },
  DENSE_RANK: {
    funcao: 'DENSE_RANK()',
    oQueFaz: 'Também divide a posição no empate, mas não pula nenhum número: depois de dois em 1º, vem o 2º.',
    exemplo: {
      area: 'Fidelidade',
      pergunta: 'Em qual nível do programa de pontos fica cada cliente?',
      sql: `SELECT cliente, pontos,
       DENSE_RANK() OVER (ORDER BY pontos DESC) AS nivel
FROM fidelidade;`,
      colunas: ['cliente', 'pontos', 'nivel'],
      linhas: [
        ['Bia', 900, 1],
        ['Caio', 900, 1],
        ['Duda', 750, 2],
        ['Enzo', 600, 3],
      ],
      destaque: 'nivel',
      conclusao: 'Os níveis saem 1, 2 e 3, sem buraco. Dá para ligar direto: 1 é ouro, 2 é prata, 3 é bronze.',
    },
    onde: [
      { area: 'RH', texto: 'Achar o 2º maior salário da empresa, mesmo com várias pessoas empatadas no topo.' },
      { area: 'Fidelidade', texto: 'Separar clientes em faixas (ouro, prata, bronze) pela pontuação.' },
      { area: 'Catálogo', texto: 'Listar os 3 preços diferentes mais altos de uma categoria.' },
    ],
  },
  SUM: {
    funcao: 'SUM() OVER',
    oQueFaz: 'Soma os valores da janela e repete o total em cada linha. Assim cada linha fica ao lado do total do seu grupo.',
    exemplo: {
      area: 'Financeiro',
      pergunta: 'Quanto cada produto faturou, e quanto a loja dele faturou no total?',
      sql: `SELECT loja, produto, faturamento,
       SUM(faturamento) OVER (PARTITION BY loja) AS total_loja
FROM vendas_por_produto;`,
      colunas: ['loja', 'produto', 'faturamento', 'total_loja'],
      linhas: [
        ['Centro', 'Fone', 3000, 8000],
        ['Centro', 'Caixa de som', 5000, 8000],
        ['Norte', 'Fone', 2000, 6000],
        ['Norte', 'Carregador', 4000, 6000],
      ],
      destaque: 'total_loja',
      conclusao: 'Com o total ao lado, dá para ver na hora que a Caixa de som responde por mais da metade do faturamento do Centro.',
    },
    onde: [
      { area: 'Financeiro', texto: 'Mostrar cada venda ao lado do total da loja, para ver quem puxa o faturamento.' },
      { area: 'Logística', texto: 'Peso total do pedido ao lado de cada item, para escolher a caixa de envio.' },
      { area: 'Marketing', texto: 'Total de cliques da campanha ao lado de cada anúncio dela.' },
    ],
  },
  AVG: {
    funcao: 'AVG() OVER',
    oQueFaz: 'Calcula a média da janela e repete em cada linha. Fazendo valor menos média, você descobre quem está acima ou abaixo do grupo.',
    exemplo: {
      area: 'RH',
      pergunta: 'Quem ganha acima ou abaixo da média do próprio departamento?',
      sql: `SELECT nome, depto, salario,
       salario - AVG(salario) OVER (PARTITION BY depto) AS dif_media
FROM funcionarios;`,
      colunas: ['nome', 'depto', 'salario', 'dif_media'],
      linhas: [
        ['Marta', 'TI', 9000, 1000],
        ['Leo', 'TI', 7000, -1000],
        ['Rui', 'Vendas', 4000, 500],
        ['Lia', 'Vendas', 3000, -500],
      ],
      destaque: 'dif_media',
      conclusao: 'A média da TI é 8.000. O Leo ganha 1.000 abaixo dela: um sinal para o RH revisar o salário dele.',
    },
    onde: [
      { area: 'RH', texto: 'Comparar cada salário com a média do cargo ou do departamento.' },
      { area: 'Varejo', texto: 'Encontrar as lojas que vendem abaixo da média da região.' },
      { area: 'Delivery', texto: 'Ver quais entregadores demoram mais que a média da cidade.' },
    ],
  },
  LAG: {
    funcao: 'LAG()',
    oQueFaz: 'Traz para a linha atual um valor da linha de cima, na ordem do OVER. A primeira linha não tem ninguém em cima, então recebe NULL.',
    exemplo: {
      area: 'Financeiro',
      pergunta: 'O faturamento subiu ou caiu em relação ao mês anterior?',
      sql: `SELECT mes, faturamento_mil,
       faturamento_mil - LAG(faturamento_mil) OVER (ORDER BY mes) AS variacao
FROM faturamento_mensal;`,
      colunas: ['mes', 'faturamento_mil', 'variacao'],
      linhas: [
        ['2026-01', 100, null],
        ['2026-02', 120, 20],
        ['2026-03', 90, -30],
      ],
      destaque: 'variacao',
      conclusao: 'Março caiu 30 mil em relação a fevereiro. É a pergunta que a diretoria faz em toda reunião de resultado.',
    },
    onde: [
      { area: 'Financeiro', texto: 'Crescimento ou queda do faturamento de um mês para o outro.' },
      { area: 'Produto', texto: 'Comparar o uso de hoje com o do último acesso, para achar quem está usando menos o app.' },
      { area: 'Mercado', texto: 'Variação do preço de um produto ou de uma ação em relação ao dia anterior.' },
    ],
  },
  LEAD: {
    funcao: 'LEAD()',
    oQueFaz: 'O contrário do LAG: traz o valor da linha de baixo, a próxima na ordem do OVER. A última linha recebe NULL.',
    exemplo: {
      area: 'Assinaturas',
      pergunta: 'Para qual plano a cliente foi depois de cada mês?',
      sql: `SELECT mes, plano,
       LEAD(plano) OVER (ORDER BY mes) AS proximo_plano
FROM historico_planos
WHERE cliente = 'Gabi';`,
      colunas: ['mes', 'plano', 'proximo_plano'],
      linhas: [
        ['2026-07', 'Grátis', 'Individual'],
        ['2026-08', 'Individual', 'Família'],
        ['2026-09', 'Família', null],
      ],
      destaque: 'proximo_plano',
      conclusao: 'Com o próximo plano na mesma linha, o time de Produto conta quantas pessoas saem do Grátis para um plano pago.',
    },
    onde: [
      { area: 'Produto', texto: 'Descobrir o que o usuário fez logo depois de ver um anúncio ou uma tela.' },
      { area: 'Assinaturas', texto: 'Ver se o cliente fez upgrade, downgrade ou cancelou no mês seguinte.' },
      { area: 'Logística', texto: 'Horário da próxima parada da rota, para medir o intervalo entre entregas.' },
    ],
  },
  ACUMULADO: {
    funcao: 'SUM() OVER (ORDER BY …)',
    oQueFaz: 'Com ORDER BY dentro do OVER, o SUM vai somando linha a linha: cada linha mostra o total do começo até ela.',
    exemplo: {
      area: 'Metas',
      pergunta: 'Em que mês a empresa bateu a meta de 300 mil no trimestre?',
      sql: `SELECT mes, faturamento_mil,
       SUM(faturamento_mil) OVER (ORDER BY mes) AS acumulado
FROM faturamento_mensal;`,
      colunas: ['mes', 'faturamento_mil', 'acumulado'],
      linhas: [
        ['2026-01', 100, 100],
        ['2026-02', 120, 220],
        ['2026-03', 90, 310],
      ],
      destaque: 'acumulado',
      conclusao: 'O acumulado passa de 300 em março: a meta do trimestre foi batida no último mês.',
    },
    onde: [
      { area: 'Banco', texto: 'Saldo do extrato depois de cada lançamento.' },
      { area: 'Vendas', texto: 'Quanto já foi vendido no mês até hoje, para acompanhar a meta.' },
      { area: 'Estoque', texto: 'Saldo do estoque somando as entradas e descontando as saídas.' },
    ],
  },
}

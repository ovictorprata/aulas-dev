// Banco "loja": uma rede de lojas de acessórios para celular, usado na lista extra.

type Func = [number, string, number, string, number]
export const FUNCIONARIOS: Func[] = [
  [1, 'Ana Lima', 1, 'Gerente', 4500],
  [2, 'Bruno Costa', 1, 'Vendedor', 3200],
  [3, 'Carla Souza', 1, 'Vendedora', 3200],
  [4, 'Diego Alves', 1, 'Caixa', 2400],
  [5, 'Elisa Rocha', 2, 'Gerente', 4200],
  [6, 'Fábio Nunes', 2, 'Vendedor', 3500],
  [7, 'Gabriel Melo', 2, 'Caixa', 2400],
  [8, 'Helena Dias', 2, 'Estoquista', 2100],
  [9, 'Igor Pires', 3, 'Gerente', 3800],
  [10, 'Júlia Ramos', 3, 'Vendedora', 3200],
  [11, 'Kaio Teixeira', 3, 'Caixa', 2400],
  [12, 'Larissa Moura', 3, 'Estoquista', 2000],
]

const LOJAS: [number, string, string][] = [
  [1, 'Loja Paulista', 'São Paulo'],
  [2, 'Loja Centro', 'Campinas'],
  [3, 'Loja Gonzaga', 'Santos'],
]

const CLIENTES: [number, string][] = [
  [1, 'Marina Alves'], [2, 'Pedro Santos'], [3, 'Luana Ferreira'],
  [4, 'Rafael Gomes'], [5, 'Bianca Torres'], [6, 'Thiago Lopes'],
]

const PRODUTOS: [number, string, string, number][] = [
  [1, 'Fone Bluetooth', 'Áudio', 199.9],
  [2, 'Caixa de Som', 'Áudio', 349.0],
  [3, 'Carregador', 'Energia', 89.9],
  [4, 'Smartwatch', 'Wearable', 899.0],
  [5, 'Capa de Celular', 'Proteção', 49.9],
  [6, 'Power Bank', 'Energia', 159.9],
]

// id, data, loja, cliente, produto, quantidade
const VENDAS: [number, string, number, number, number, number][] = [
  [1, '2026-09-01', 1, 1, 1, 1], [2, '2026-09-01', 1, 2, 3, 2], [3, '2026-09-01', 2, 3, 2, 1],
  [4, '2026-09-02', 1, 1, 5, 1], [5, '2026-09-02', 3, 4, 2, 1], [6, '2026-09-02', 3, 5, 6, 2],
  [7, '2026-09-03', 2, 2, 1, 1], [8, '2026-09-03', 2, 6, 3, 1], [9, '2026-09-03', 2, 3, 5, 2],
  [10, '2026-09-05', 1, 4, 6, 1], [11, '2026-09-05', 1, 4, 5, 1], [12, '2026-09-05', 3, 1, 6, 1],
  [13, '2026-09-06', 2, 5, 2, 1], [14, '2026-09-06', 1, 6, 1, 2], [15, '2026-09-08', 3, 2, 4, 1],
  [16, '2026-09-08', 3, 3, 3, 1], [17, '2026-09-08', 3, 6, 5, 3], [18, '2026-09-09', 1, 5, 3, 1],
  [19, '2026-09-10', 2, 1, 2, 1], [20, '2026-09-10', 2, 4, 1, 1],
]

const q = (s: string) => `'${s.replace(/'/g, "''")}'`
const money = (n: number) => n.toFixed(2)
const preco = (id: number) => PRODUTOS.find((p) => p[0] === id)![3]

/** Script que cria o banco. Valores em dinheiro usam DECIMAL no MySQL e REAL no SQLite. */
export const LOJA_SQL = `CREATE TABLE lojas (
  id     INT PRIMARY KEY,
  nome   VARCHAR(40),
  cidade VARCHAR(40)
);
INSERT INTO lojas (id, nome, cidade) VALUES
${LOJAS.map(([i, n, c]) => `  (${i}, ${q(n)}, ${q(c)})`).join(',\n')};

CREATE TABLE funcionarios (
  id      INT PRIMARY KEY,
  nome    VARCHAR(40),
  loja_id INT,
  cargo   VARCHAR(30),
  salario DECIMAL(10,2)
);
INSERT INTO funcionarios (id, nome, loja_id, cargo, salario) VALUES
${FUNCIONARIOS.map(([i, n, l, c, s]) => `  (${i}, ${q(n)}, ${l}, ${q(c)}, ${money(s)})`).join(',\n')};

CREATE TABLE clientes (
  id   INT PRIMARY KEY,
  nome VARCHAR(40)
);
INSERT INTO clientes (id, nome) VALUES
${CLIENTES.map(([i, n]) => `  (${i}, ${q(n)})`).join(',\n')};

CREATE TABLE produtos (
  id        INT PRIMARY KEY,
  nome      VARCHAR(40),
  categoria VARCHAR(20),
  preco     DECIMAL(10,2)
);
INSERT INTO produtos (id, nome, categoria, preco) VALUES
${PRODUTOS.map(([i, n, c, p]) => `  (${i}, ${q(n)}, ${q(c)}, ${money(p)})`).join(',\n')};

CREATE TABLE vendas (
  id          INT PRIMARY KEY,
  data_venda  DATE,
  loja_id     INT,
  cliente_id  INT,
  produto_id  INT,
  quantidade  INT,
  valor_total DECIMAL(10,2)
);
INSERT INTO vendas (id, data_venda, loja_id, cliente_id, produto_id, quantidade, valor_total) VALUES
${VENDAS.map(([i, d, l, c, p, qt]) => `  (${i}, ${q(d)}, ${l}, ${c}, ${p}, ${qt}, ${money(preco(p) * qt)})`).join(',\n')};
`

DROP DATABASE IF EXISTS loja;
CREATE DATABASE loja;
USE loja;

CREATE TABLE lojas (
  id     INT PRIMARY KEY,
  nome   VARCHAR(40),
  cidade VARCHAR(40)
);
INSERT INTO lojas (id, nome, cidade) VALUES
  (1, 'Loja Paulista', 'São Paulo'),
  (2, 'Loja Centro', 'Campinas'),
  (3, 'Loja Gonzaga', 'Santos');

CREATE TABLE funcionarios (
  id      INT PRIMARY KEY,
  nome    VARCHAR(40),
  loja_id INT,
  cargo   VARCHAR(30),
  salario DECIMAL(10,2)
);
INSERT INTO funcionarios (id, nome, loja_id, cargo, salario) VALUES
  (1, 'Ana Lima', 1, 'Gerente', 4500.00),
  (2, 'Bruno Costa', 1, 'Vendedor', 3200.00),
  (3, 'Carla Souza', 1, 'Vendedora', 3200.00),
  (4, 'Diego Alves', 1, 'Caixa', 2400.00),
  (5, 'Elisa Rocha', 2, 'Gerente', 4200.00),
  (6, 'Fábio Nunes', 2, 'Vendedor', 3500.00),
  (7, 'Gabriel Melo', 2, 'Caixa', 2400.00),
  (8, 'Helena Dias', 2, 'Estoquista', 2100.00),
  (9, 'Igor Pires', 3, 'Gerente', 3800.00),
  (10, 'Júlia Ramos', 3, 'Vendedora', 3200.00),
  (11, 'Kaio Teixeira', 3, 'Caixa', 2400.00),
  (12, 'Larissa Moura', 3, 'Estoquista', 2000.00);

CREATE TABLE clientes (
  id   INT PRIMARY KEY,
  nome VARCHAR(40)
);
INSERT INTO clientes (id, nome) VALUES
  (1, 'Marina Alves'),
  (2, 'Pedro Santos'),
  (3, 'Luana Ferreira'),
  (4, 'Rafael Gomes'),
  (5, 'Bianca Torres'),
  (6, 'Thiago Lopes');

CREATE TABLE produtos (
  id        INT PRIMARY KEY,
  nome      VARCHAR(40),
  categoria VARCHAR(20),
  preco     DECIMAL(10,2)
);
INSERT INTO produtos (id, nome, categoria, preco) VALUES
  (1, 'Fone Bluetooth', 'Áudio', 199.90),
  (2, 'Caixa de Som', 'Áudio', 349.00),
  (3, 'Carregador', 'Energia', 89.90),
  (4, 'Smartwatch', 'Wearable', 899.00),
  (5, 'Capa de Celular', 'Proteção', 49.90),
  (6, 'Power Bank', 'Energia', 159.90);

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
  (1, '2026-09-01', 1, 1, 1, 1, 199.90),
  (2, '2026-09-01', 1, 2, 3, 2, 179.80),
  (3, '2026-09-01', 2, 3, 2, 1, 349.00),
  (4, '2026-09-02', 1, 1, 5, 1, 49.90),
  (5, '2026-09-02', 3, 4, 2, 1, 349.00),
  (6, '2026-09-02', 3, 5, 6, 2, 319.80),
  (7, '2026-09-03', 2, 2, 1, 1, 199.90),
  (8, '2026-09-03', 2, 6, 3, 1, 89.90),
  (9, '2026-09-03', 2, 3, 5, 2, 99.80),
  (10, '2026-09-05', 1, 4, 6, 1, 159.90),
  (11, '2026-09-05', 1, 4, 5, 1, 49.90),
  (12, '2026-09-05', 3, 1, 6, 1, 159.90),
  (13, '2026-09-06', 2, 5, 2, 1, 349.00),
  (14, '2026-09-06', 1, 6, 1, 2, 399.80),
  (15, '2026-09-08', 3, 2, 4, 1, 899.00),
  (16, '2026-09-08', 3, 3, 3, 1, 89.90),
  (17, '2026-09-08', 3, 6, 5, 3, 149.70),
  (18, '2026-09-09', 1, 5, 3, 1, 89.90),
  (19, '2026-09-10', 2, 1, 2, 1, 349.00),
  (20, '2026-09-10', 2, 4, 1, 1, 199.90);

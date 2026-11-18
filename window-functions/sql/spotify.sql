DROP DATABASE IF EXISTS spotify;
CREATE DATABASE spotify;
USE spotify;

CREATE TABLE mais_ouvidas (
  usuario VARCHAR(20),
  musica  VARCHAR(60),
  plays   INT
);
INSERT INTO mais_ouvidas (usuario, musica, plays) VALUES
  ('Bruno', 'Tempo Perdido', 61),
  ('Ana', 'Swim', 87),
  ('Bruno', 'Jetski', 140),
  ('Ana', 'Anunciação', 45),
  ('Ana', 'The Fate of Ophelia', 132),
  ('Bruno', 'Eu Te Seguro', 33),
  ('Ana', 'P do Pecado', 87),
  ('Bruno', 'Talvez Você Precise de Mim', 92),
  ('Ana', 'Evidências', 98),
  ('Bruno', 'Quem É Esse?', 110);

CREATE TABLE acessos (
  usuario     VARCHAR(20),
  data_acesso DATE,
  minutos     INT
);
INSERT INTO acessos (usuario, data_acesso, minutos) VALUES
  ('Ana', '2026-11-01', 42),
  ('Ana', '2026-11-02', 35),
  ('Ana', '2026-11-03', 58),
  ('Ana', '2026-11-05', 20),
  ('Ana', '2026-11-06', 64),
  ('Ana', '2026-11-12', 31),
  ('Bruno', '2026-11-01', 90),
  ('Bruno', '2026-11-08', 15),
  ('Bruno', '2026-11-09', 47),
  ('Bruno', '2026-11-10', 120),
  ('Bruno', '2026-11-20', 38);

CREATE TABLE assinaturas (
  mes               CHAR(7),
  plano             VARCHAR(20),
  novas_assinaturas INT
);
INSERT INTO assinaturas (mes, plano, novas_assinaturas) VALUES
  ('2026-07', 'Individual', 1200),
  ('2026-08', 'Individual', 1350),
  ('2026-09', 'Individual', 1280),
  ('2026-10', 'Individual', 1500),
  ('2026-07', 'Universitário', 400),
  ('2026-08', 'Universitário', 950),
  ('2026-09', 'Universitário', 700),
  ('2026-10', 'Universitário', 720);

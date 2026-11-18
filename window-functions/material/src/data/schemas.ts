import type { Banco } from '../lib/sql'
import { SPOTIFY_SQL } from './spotify'
import { LOJA_SQL } from './loja'

export const SCHEMAS: Record<Banco, { nome: string; colunas: string[] }[]> = {
  spotify: [
    { nome: 'mais_ouvidas', colunas: ['usuario', 'musica', 'plays'] },
    { nome: 'acessos', colunas: ['usuario', 'data_acesso', 'minutos'] },
    { nome: 'assinaturas', colunas: ['mes', 'plano', 'novas_assinaturas'] },
  ],
  loja: [
    { nome: 'lojas', colunas: ['id', 'nome', 'cidade'] },
    { nome: 'funcionarios', colunas: ['id', 'nome', 'loja_id', 'cargo', 'salario'] },
    { nome: 'clientes', colunas: ['id', 'nome'] },
    { nome: 'produtos', colunas: ['id', 'nome', 'categoria', 'preco'] },
    { nome: 'vendas', colunas: ['id', 'data_venda', 'loja_id', 'cliente_id', 'produto_id', 'quantidade', 'valor_total'] },
  ],
}

/** Versão do script para colar no MySQL Workbench: cria o banco e já entra nele. */
export function scriptMySQL(banco: Banco) {
  const corpo = banco === 'spotify' ? SPOTIFY_SQL : LOJA_SQL
  return `DROP DATABASE IF EXISTS ${banco};\nCREATE DATABASE ${banco};\nUSE ${banco};\n\n${corpo}`
}

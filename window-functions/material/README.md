# Window Functions — material da aula

Material interativo (React + Vite + TypeScript) com explicação passo a passo, editor de SQL no navegador e lista de exercícios com correção automática.

## Rodar localmente

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # gera dist/index.html, um arquivo único que abre direto no navegador
```

## Bancos

- `../sql/spotify.sql` e `../sql/loja.sql`: scripts para o MySQL Workbench (criam o banco e as tabelas).
- No site, os mesmos dados rodam num SQLite dentro do navegador (`sql.js`), onde as window functions funcionam igual ao MySQL 8.

# Gastos do Bichinho 🐶

Controle de gastos do cachorro para José e Karen.

## Pré-requisitos
- Node.js 18+
- Conta no [Turso](https://turso.tech) (free tier)
- Conta na [Vercel](https://vercel.com)

## Setup local

1. Instale as dependências:
```bash
npm install
```

2. Crie o arquivo `.env.local` com as credenciais do Turso:
```bash
cp .env.example .env.local
# Edite .env.local com seus valores reais
```

3. Rode localmente:
```bash
npm run dev
```

4. Inicialize o banco de dados — acesse no navegador uma vez:
```
http://localhost:3000/api/init
```

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `TURSO_DATABASE_URL` | URL do banco Turso (libsql://...) |
| `TURSO_AUTH_TOKEN` | Token de autenticação do Turso |

## Deploy na Vercel

1. Crie um repositório no GitHub e faça push do projeto
2. Importe no [Vercel](https://vercel.com/new)
3. Adicione as variáveis de ambiente no painel da Vercel
4. Após o primeiro deploy, acesse `https://seu-app.vercel.app/api/init` para criar a tabela

## Como usar

- **Aba Gastos:** lista e adiciona gastos. Use as setas para navegar entre meses.
- **Aba PnL:** total do mês, breakdown por setor, por pagador e comparativo com mês anterior.
- Toque no lápis para editar, na lixeira para deletar (pede confirmação).

# ARCHITECTURE — Dog Expenses Tracker

## Stack
- **Frontend + Backend:** Next.js 14 (App Router) — uma única codebase, deploy na Vercel
- **Banco de dados:** Turso (SQLite distribuído, free tier)
- **UI:** Tailwind CSS + shadcn/ui (componentes acessíveis, mobile-first)
- **ORM:** @libsql/client (direto, sem ORM extra)

## Estrutura de Pastas
```
dog-expenses/
├── app/
│   ├── layout.tsx          # Layout raiz, navegação inferior
│   ├── page.tsx            # Lista de gastos (mês atual)
│   ├── pnl/
│   │   └── page.tsx        # PnL mensal
│   └── api/
│       └── expenses/
│           ├── route.ts    # GET (listar) + POST (criar)
│           └── [id]/
│               └── route.ts # PUT (editar) + DELETE (remover)
├── components/
│   ├── ExpenseForm.tsx     # Formulário novo/editar (Sheet mobile)
│   ├── ExpenseList.tsx     # Lista do mês com filtro
│   ├── ExpenseItem.tsx     # Card de cada gasto
│   ├── MonthPicker.tsx     # Seletor mês/ano
│   └── PnLView.tsx         # Visualização PnL
├── lib/
│   ├── db.ts               # Cliente Turso
│   ├── types.ts            # Tipos TypeScript
│   └── constants.ts        # Setores, pagadores
└── ...configs
```

## Fluxo de Dados
```
Browser → Next.js Server Components (leitura direta do DB)
Browser → API Routes (mutations: criar/editar/deletar)
```

Leituras usam Server Components para SSR rápido.
Mutations usam API Routes com revalidação de cache.

## Deploy
- GitHub → Vercel (deploy automático em push)
- Variáveis de ambiente: TURSO_URL + TURSO_AUTH_TOKEN

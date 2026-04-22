# PLAN — Dog Expenses Tracker

## Milestone 1 — Scaffolding & Deploy Base
- Criar projeto Next.js com TypeScript + Tailwind
- Instalar dependências (shadcn/ui, @libsql/client)
- Configurar cliente Turso + schema do banco
- Layout com navegação inferior (Gastos | PnL)
- Deploy inicial na Vercel funcionando

## Milestone 2 — CRUD de Gastos
- API routes: GET, POST, PUT, DELETE
- Lista de gastos por mês (mês atual como padrão)
- Seletor de mês
- Sheet mobile para adicionar gasto
- Sheet mobile para editar gasto
- Confirmação e deleção de gasto

## Milestone 3 — PnL
- Página de PnL com seletor de mês
- Total gasto no mês
- Breakdown por setor (barras visuais)
- Breakdown por pagador (José vs Karen)
- Comparativo com mês anterior (R$ e %)

## Milestone 4 — Polish
- Estados de loading e empty state
- Tratamento de erros (toast de feedback)
- Formatação de moeda em R$
- Validações de formulário
- Revisão de UX mobile

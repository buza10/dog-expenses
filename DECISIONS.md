# DECISIONS

## Next.js App Router
**Decisão:** Usar Next.js 14 com App Router
**Motivo:** Permite Server Components (leitura rápida do DB sem API), API Routes para mutations, e deploy nativo na Vercel.
**Alternativas descartadas:** Vite+React (sem SSR nativo), Remix (menos familiar no ecossistema Vercel do usuário).

## Turso como banco de dados
**Decisão:** Turso (SQLite distribuído)
**Motivo:** Usuário já usa no projeto TUYO, free tier generoso, latência baixa, sem configuração de servidor.
**Alternativas descartadas:** Neon/Supabase (PostgreSQL, mais pesado para este escopo), Vercel KV (não relacional).

## Sem autenticação
**Decisão:** App acessível por URL direta sem login
**Motivo:** Decisão explícita do usuário. Apenas dois usuários de confiança.
**Risco aceito:** Qualquer pessoa com o link pode ler e modificar dados.

## shadcn/ui para componentes
**Decisão:** shadcn/ui + Tailwind
**Motivo:** Componentes acessíveis, Sheet (drawer mobile) nativo, sem bundle overhead de library completa.
**Alternativas descartadas:** MUI (pesado), Chakra (dependências extras).

## Server Components para leitura
**Decisão:** Páginas como Server Components, mutations via API Routes + revalidatePath
**Motivo:** Sem estado cliente para dados, SSR rápido, cache automático do Next.js.

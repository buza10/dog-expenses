# SPEC — Dog Expenses Tracker

## Visão
Aplicação web mobile-first para José e Karen registrarem e acompanharem os gastos do cachorro, com acesso por link simples e visão de PnL mensal.

## Problema
Gastos com o cachorro são feitos por duas pessoas sem controle centralizado, dificultando entender quanto é gasto por mês, em qual área e quem está pagando mais.

## Usuários
- José e Karen — casal, acesso pelo mesmo link, sem distinção de perfil

## Escopo

### Dentro do MVP
- Registrar gasto (descrição, valor, data, tipo, setor, quem pagou)
- Editar e deletar gasto
- Listar gastos com filtro por mês
- PnL mensal: total, por setor, por pagador, variação mês a mês

### Fora do escopo (por ora)
- Login / autenticação
- Múltiplos animais
- Recorrência automática de gastos fixos
- Exportação para planilha
- Notificações

## Modelo de Dados

### Tabela: expenses
| Campo       | Tipo    | Descrição                        |
|-------------|---------|----------------------------------|
| id          | integer | PK autoincrement                 |
| description | text    | O que foi o gasto                |
| amount      | real    | Valor em R$                      |
| date        | text    | Data do gasto (YYYY-MM-DD)       |
| type        | text    | "fixed" ou "variable"            |
| sector      | text    | Setor (lista abaixo)             |
| paid_by     | text    | "José" ou "Karen"                |
| created_at  | text    | ISO datetime                     |
| updated_at  | text    | ISO datetime                     |

### Setores (lista inicial, editável no código)
- Alimentação
- Veterinário
- Medicamentos
- Higiene & Banho
- Petshop
- Passeios & Lazer
- Brinquedos & Acessórios
- Outros

## Fluxos Principais

### Registrar gasto
1. Usuário abre o app no celular
2. Toca em "+ Novo Gasto"
3. Preenche: descrição, valor, data, tipo, setor, quem pagou
4. Salva — gasto aparece na lista do mês atual

### Ver PnL
1. Usuário acessa aba "PnL"
2. Seleciona mês/ano (padrão: mês atual)
3. Vê: total do mês, breakdown por setor, breakdown por pagador
4. Vê comparativo com mês anterior (quanto variou em R$ e %)

### Editar / Deletar
1. Na lista, toca no gasto
2. Pode editar qualquer campo ou deletar
3. Confirmação antes de deletar

## Requisitos Não-Funcionais
- Mobile-first, funciona bem em telas 375px+
- Acesso por URL direta (sem login)
- Resposta rápida (< 500ms para operações comuns)
- Hospedado na Vercel (zero custo)

## Critérios de Aceite
- [ ] É possível registrar um gasto em menos de 30 segundos no celular
- [ ] O PnL mostra o total correto por mês
- [ ] O breakdown por setor e por pagador está correto
- [ ] É possível editar e deletar qualquer gasto
- [ ] O app funciona no navegador mobile sem instalar nada

## Riscos
- **Sem autenticação:** qualquer pessoa com o link pode ver e alterar dados — aceito pelo usuário

export const SECTORS = [
  "Alimentação",
  "Veterinário",
  "Medicamentos",
  "Higiene & Banho",
  "Petshop",
  "Passeios & Lazer",
  "Brinquedos & Acessórios",
  "Outros",
] as const;

export const PAYERS = ["José", "Karen"] as const;

export const EXPENSE_TYPES = [
  { value: "fixed", label: "Fixo" },
  { value: "variable", label: "Variável" },
] as const;

export type Sector = (typeof SECTORS)[number];
export type Payer = (typeof PAYERS)[number];
export type ExpenseType = "fixed" | "variable";

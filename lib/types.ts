import type { Payer, Sector, ExpenseType } from "./constants";

export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: ExpenseType;
  sector: Sector;
  paid_by: Payer;
  created_at: string;
  updated_at: string;
}

export interface PnLData {
  totalAmount: number;
  previousMonthAmount: number;
  momDelta: number;
  momPercent: number | null;
  bySector: { sector: string; amount: number }[];
  byPayer: { paid_by: string; amount: number }[];
  byType: { type: string; amount: number }[];
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { MonthPicker } from "./MonthPicker";
import { ExpenseItem } from "./ExpenseItem";
import { ExpenseForm } from "./ExpenseForm";
import { formatCurrency, currentMonth } from "@/lib/format";
import type { Expense } from "@/lib/types";

export function ExpenseList() {
  const [month, setMonth] = useState(currentMonth());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/expenses?month=${month}`);
    const data = await res.json();
    setExpenses(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [month]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <MonthPicker month={month} onChange={setMonth} />
        <Button size="sm" className="gap-1" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4" />
          Novo
        </Button>
      </div>

      {expenses.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/40 text-sm">
          <span className="text-muted-foreground">{expenses.length} {expenses.length === 1 ? "gasto" : "gastos"}</span>
          <span className="font-semibold">{formatCurrency(total)}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Carregando...
          </div>
        ) : expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground">
            <span className="text-4xl">🐶</span>
            <p className="text-sm">Nenhum gasto neste mês</p>
          </div>
        ) : (
          <div className="px-4">
            {expenses.map((expense, i) => (
              <div key={expense.id}>
                <ExpenseItem expense={expense} onChanged={fetchExpenses} />
                {i < expenses.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </div>

      <Sheet open={adding} onOpenChange={setAdding}>
        <SheetContent side="bottom" className="max-h-[92dvh] overflow-y-auto rounded-t-xl px-4 pb-8">
          <SheetHeader>
            <SheetTitle>Novo Gasto</SheetTitle>
          </SheetHeader>
          <ExpenseForm
            onSuccess={() => { setAdding(false); fetchExpenses(); }}
            onCancel={() => setAdding(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

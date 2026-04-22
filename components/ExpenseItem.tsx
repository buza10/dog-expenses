"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ExpenseForm } from "./ExpenseForm";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Expense } from "@/lib/types";

interface ExpenseItemProps {
  expense: Expense;
  onChanged: () => void;
}

export function ExpenseItem({ expense, onChanged }: ExpenseItemProps) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await fetch(`/api/expenses/${expense.id}`, { method: "DELETE" });
    setConfirming(false);
    setDeleting(false);
    onChanged();
  };

  return (
    <>
      <div className="flex items-start justify-between gap-2 py-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm truncate">{expense.description}</span>
            <Badge variant={expense.type === "fixed" ? "secondary" : "outline"} className="text-xs shrink-0">
              {expense.type === "fixed" ? "Fixo" : "Variável"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground flex-wrap">
            <span>{formatDate(expense.date)}</span>
            <span>·</span>
            <span>{expense.sector}</span>
            <span>·</span>
            <span>{expense.paid_by}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="font-semibold text-sm">{formatCurrency(expense.amount)}</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(true)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setConfirming(true)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <Sheet open={editing} onOpenChange={setEditing}>
        <SheetContent side="bottom" className="max-h-[92dvh] overflow-y-auto rounded-t-xl px-4 pb-8">
          <SheetHeader>
            <SheetTitle>Editar Gasto</SheetTitle>
          </SheetHeader>
          <ExpenseForm
            expense={expense}
            onSuccess={() => { setEditing(false); onChanged(); }}
            onCancel={() => setEditing(false)}
          />
        </SheetContent>
      </Sheet>

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Deletar gasto?</DialogTitle>
            <DialogDescription>
              &ldquo;{expense.description}&rdquo; ({formatCurrency(expense.amount)}) será removido permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setConfirming(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="flex-1" disabled={deleting} onClick={handleDelete}>
              {deleting ? "Deletando..." : "Deletar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

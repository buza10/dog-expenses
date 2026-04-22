"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SECTORS, PAYERS, EXPENSE_TYPES } from "@/lib/constants";
import type { Expense } from "@/lib/types";

const schema = z.object({
  description: z.string().min(1, "Informe a descrição"),
  amount: z.string().min(1, "Informe o valor").refine((v) => !isNaN(Number(v.replace(",", "."))) && Number(v.replace(",", ".")) > 0, "Valor inválido"),
  date: z.string().min(1, "Informe a data"),
  type: z.enum(["fixed", "variable"]),
  sector: z.string().min(1, "Escolha o setor"),
  paid_by: z.string().min(1, "Informe quem pagou"),
});

type FormData = z.infer<typeof schema>;

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ExpenseForm({ expense, onSuccess, onCancel }: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: expense
      ? {
          description: expense.description,
          amount: String(expense.amount).replace(".", ","),
          date: expense.date,
          type: expense.type,
          sector: expense.sector,
          paid_by: expense.paid_by,
        }
      : {
          date: new Date().toISOString().slice(0, 10),
          type: "variable",
        },
  });

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      amount: Number(data.amount.replace(",", ".")),
    };

    const url = expense ? `/api/expenses/${expense.id}` : "/api/expenses";
    const method = expense ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <div className="space-y-1">
        <Label htmlFor="description">Descrição</Label>
        <Input id="description" placeholder="Ex: Ração Golden" {...register("description")} />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="amount">Valor (R$)</Label>
        <Input id="amount" inputMode="decimal" placeholder="0,00" {...register("amount")} />
        {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="date">Data</Label>
        <Input id="date" type="date" {...register("date")} />
        {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>Tipo</Label>
        <Select value={watch("type") ?? undefined} onValueChange={(v) => setValue("type", v as "fixed" | "variable")}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            {EXPENSE_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>Setor</Label>
        <Select value={watch("sector") ?? undefined} onValueChange={(v) => { if (v) setValue("sector", v); }}>
          <SelectTrigger>
            <SelectValue placeholder="Setor" />
          </SelectTrigger>
          <SelectContent>
            {SECTORS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.sector && <p className="text-xs text-red-500">{errors.sector.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>Quem pagou</Label>
        <Select value={watch("paid_by") ?? undefined} onValueChange={(v) => { if (v) setValue("paid_by", v); }}>
          <SelectTrigger>
            <SelectValue placeholder="Quem pagou" />
          </SelectTrigger>
          <SelectContent>
            {PAYERS.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.paid_by && <p className="text-xs text-red-500">{errors.paid_by.message}</p>}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : expense ? "Salvar" : "Adicionar"}
        </Button>
      </div>
    </form>
  );
}

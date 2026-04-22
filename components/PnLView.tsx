"use client";

import { useState, useEffect, useCallback } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthPicker } from "./MonthPicker";
import { formatCurrency, currentMonth } from "@/lib/format";
import type { PnLData } from "@/lib/types";

function BarRow({ label, amount, max }: { label: string; amount: number; max: number }) {
  const pct = max > 0 ? (amount / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground truncate pr-2">{label}</span>
        <span className="font-medium shrink-0">{formatCurrency(amount)}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function PnLView() {
  const [month, setMonth] = useState(currentMonth());
  const [data, setData] = useState<PnLData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/pnl?month=${month}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, [month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const maxSector = data ? Math.max(...data.bySector.map((s) => s.amount), 0) : 0;
  const maxPayer = data ? Math.max(...data.byPayer.map((p) => p.amount), 0) : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-4 py-3 border-b">
        <MonthPicker month={month} onChange={setMonth} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Carregando...
          </div>
        ) : !data ? null : (
          <>
            {/* Total */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total do mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(data.totalAmount)}</div>
                <div className="flex items-center gap-1 mt-1 text-sm">
                  {data.momPercent === null ? (
                    <span className="text-muted-foreground">Sem dados do mês anterior</span>
                  ) : data.momDelta === 0 ? (
                    <><Minus className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Igual ao mês anterior</span></>
                  ) : data.momDelta > 0 ? (
                    <><TrendingUp className="h-4 w-4 text-red-500" /><span className="text-red-500">+{formatCurrency(data.momDelta)} ({data.momPercent}%) vs mês anterior</span></>
                  ) : (
                    <><TrendingDown className="h-4 w-4 text-green-600" /><span className="text-green-600">{formatCurrency(data.momDelta)} ({data.momPercent}%) vs mês anterior</span></>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Fixo vs Variável */}
            {data.byType.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Fixo vs Variável</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.byType.map((t) => (
                    <BarRow
                      key={t.type}
                      label={t.type === "fixed" ? "Fixo" : "Variável"}
                      amount={t.amount}
                      max={data.totalAmount}
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Por setor */}
            {data.bySector.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Por setor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.bySector.map((s) => (
                    <BarRow key={s.sector} label={s.sector} amount={s.amount} max={maxSector} />
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Por pagador */}
            {data.byPayer.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Quem pagou</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.byPayer.map((p) => (
                    <BarRow key={p.paid_by} label={p.paid_by} amount={p.amount} max={maxPayer} />
                  ))}
                </CardContent>
              </Card>
            )}

            {data.totalAmount === 0 && (
              <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground">
                <span className="text-4xl">📊</span>
                <p className="text-sm">Nenhum gasto neste mês</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

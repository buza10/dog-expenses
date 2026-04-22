import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { PnLData } from "@/lib/types";

function prevMonth(month: string): string {
  const [year, m] = month.split("-").map(Number);
  const d = new Date(year, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month") ?? new Date().toISOString().slice(0, 7);
  const previous = prevMonth(month);

  try {
    const db = getDb();
    const [totalRes, prevRes, sectorRes, payerRes, typeRes] = await Promise.all([
      db.execute({
        sql: `SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE strftime('%Y-%m', date) = ?`,
        args: [month],
      }),
      db.execute({
        sql: `SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE strftime('%Y-%m', date) = ?`,
        args: [previous],
      }),
      db.execute({
        sql: `SELECT sector, SUM(amount) as amount FROM expenses WHERE strftime('%Y-%m', date) = ? GROUP BY sector ORDER BY amount DESC`,
        args: [month],
      }),
      db.execute({
        sql: `SELECT paid_by, SUM(amount) as amount FROM expenses WHERE strftime('%Y-%m', date) = ? GROUP BY paid_by ORDER BY amount DESC`,
        args: [month],
      }),
      db.execute({
        sql: `SELECT type, SUM(amount) as amount FROM expenses WHERE strftime('%Y-%m', date) = ? GROUP BY type`,
        args: [month],
      }),
    ]);

    const totalAmount = Number(totalRes.rows[0].total);
    const previousMonthAmount = Number(prevRes.rows[0].total);
    const momDelta = totalAmount - previousMonthAmount;
    const momPercent =
      previousMonthAmount > 0
        ? Math.round((momDelta / previousMonthAmount) * 100)
        : null;

    const data: PnLData = {
      totalAmount,
      previousMonthAmount,
      momDelta,
      momPercent,
      bySector: sectorRes.rows.map((r) => ({
        sector: String(r.sector),
        amount: Number(r.amount),
      })),
      byPayer: payerRes.rows.map((r) => ({
        paid_by: String(r.paid_by),
        amount: Number(r.amount),
      })),
      byType: typeRes.rows.map((r) => ({
        type: String(r.type),
        amount: Number(r.amount),
      })),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/pnl error:", error);
    return NextResponse.json({ error: "Erro ao calcular PnL" }, { status: 500 });
  }
}

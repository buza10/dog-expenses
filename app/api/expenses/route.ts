import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { Expense } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  try {
    const db = getDb();
    let result;
    if (month) {
      result = await db.execute({
        sql: `SELECT * FROM expenses WHERE strftime('%Y-%m', date) = ? ORDER BY date DESC, id DESC`,
        args: [month],
      });
    } else {
      result = await db.execute(
        `SELECT * FROM expenses ORDER BY date DESC, id DESC`
      );
    }

    const expenses = result.rows as unknown as Expense[];
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("GET /api/expenses error:", error);
    return NextResponse.json({ error: "Erro ao buscar gastos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { description, amount, date, type, sector, paid_by } = body;

    if (!description || !amount || !date || !type || !sector || !paid_by) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const result = await db.execute({
      sql: `INSERT INTO expenses (description, amount, date, type, sector, paid_by, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [description, Number(amount), date, type, sector, paid_by, now, now],
    });

    revalidatePath("/");
    revalidatePath("/pnl");
    return NextResponse.json({ id: Number(result.lastInsertRowid) }, { status: 201 });
  } catch (error) {
    console.error("POST /api/expenses error:", error);
    return NextResponse.json({ error: "Erro ao criar gasto" }, { status: 500 });
  }
}

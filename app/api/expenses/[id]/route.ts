import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const body = await request.json();
    const { description, amount, date, type, sector, paid_by } = body;

    if (!description || !amount || !date || !type || !sector || !paid_by) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    const now = new Date().toISOString();
    await db.execute({
      sql: `UPDATE expenses SET description=?, amount=?, date=?, type=?, sector=?, paid_by=?, updated_at=?
            WHERE id=?`,
      args: [description, Number(amount), date, type, sector, paid_by, now, Number(id)],
    });

    revalidatePath("/");
    revalidatePath("/pnl");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/expenses/[id] error:", error);
    return NextResponse.json({ error: "Erro ao atualizar gasto" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    await db.execute({
      sql: `DELETE FROM expenses WHERE id=?`,
      args: [Number(id)],
    });

    revalidatePath("/");
    revalidatePath("/pnl");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/expenses/[id] error:", error);
    return NextResponse.json({ error: "Erro ao deletar gasto" }, { status: 500 });
  }
}

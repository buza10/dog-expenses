import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";

export async function GET() {
  try {
    await initDb();
    return NextResponse.json({ success: true, message: "Banco inicializado com sucesso" });
  } catch (error) {
    console.error("DB init error:", error);
    return NextResponse.json({ error: "Erro ao inicializar banco" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
  await prisma.subscriber.updateMany({ where: { email }, data: { status: "UNSUB" } });
  return NextResponse.json({ ok: true });
}

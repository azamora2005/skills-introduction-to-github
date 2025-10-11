import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/newsletter?status=missing", req.url));

  const updated = await prisma.subscriber.updateMany({
    where: { confirmToken: token },
    data: { status: "ACTIVE", confirmToken: null },
  });

  const dest = updated.count > 0 ? "/newsletter?status=confirmed" : "/newsletter?status=invalid";
  return NextResponse.redirect(new URL(dest, req.url));
}

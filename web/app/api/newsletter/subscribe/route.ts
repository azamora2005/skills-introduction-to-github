import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { emailProvider } from "@/lib/email/provider";
import { env } from "@/lib/env";
import crypto from "node:crypto";

const schema = z.object({ email: z.string().email() });
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5;
const lastHits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const hits = lastHits.get(key) || [];
  const filtered = hits.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (filtered.length >= RATE_LIMIT_MAX) return true;
  filtered.push(now);
  lastHits.set(key, filtered);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin");
    if (origin && !origin.startsWith(env.NEXT_PUBLIC_SITE_URL)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") || "anon";
    if (rateLimited(ip)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const json = await req.json();
    const { email } = schema.parse(json);

    const token = crypto.randomBytes(24).toString("hex");

    const subscriber = await prisma.subscriber.upsert({
      where: { email },
      update: { status: "PENDING", confirmToken: token },
      create: { email, status: "PENDING", confirmToken: token },
    });

    const confirmUrl = `${env.NEXT_PUBLIC_SITE_URL}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;
    await emailProvider.send({
      to: email,
      subject: "Bitte bestätigen Sie Ihr Abonnement",
      html: `<p>Bitte bestätigen: <a href="${confirmUrl}">Newsletter bestätigen</a></p>`,
    });

    return NextResponse.json({ ok: true, id: subscriber.id });
  } catch (err: any) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 400 });
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

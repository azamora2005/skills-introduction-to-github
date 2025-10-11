import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  rating: z.number().min(1).max(5),
  message: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = schema.parse(json);

    const feedback = await prisma.feedback.create({
      data: {
        name: data.name,
        email: data.email,
        rating: data.rating,
        message: data.message,
      },
    });

    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: env.SHOP_OWNER_EMAIL,
      subject: `Neues Feedback von ${data.name}`,
      html: `<p>${data.message}</p><p>Bewertung: ${data.rating}/5</p><p>Absender: ${data.email}</p>`,
    });

    return NextResponse.json({ ok: true, id: feedback.id });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

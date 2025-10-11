import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "@/lib/env";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing signature", { status: 400 });

  const buf = await req.arrayBuffer();
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" as any });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed", err.message);
    return new NextResponse("Bad signature", { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (!session.id) return NextResponse.json({ ok: true });

      const exists = await prisma.order.findUnique({ where: { stripeSessionId: session.id } });
      if (!exists) {
        await prisma.order.create({
          data: {
            stripeSessionId: session.id,
            email: session.customer_email || "",
            items: [],
            subtotalCents: session.amount_subtotal ?? 0,
            totalCents: session.amount_total ?? 0,
            currency: (session.currency || "chf").toUpperCase(),
            status: "PAID",
          },
        });
      } else {
        await prisma.order.update({ where: { stripeSessionId: session.id }, data: { status: "PAID" } });
      }

      await resend.emails.send({
        from: env.EMAIL_FROM,
        to: [session.customer_email || env.SHOP_OWNER_EMAIL, env.SHOP_OWNER_EMAIL],
        subject: "Bestellbestätigung",
        html: `<p>Vielen Dank für Ihre Bestellung.</p>`
      });
    }
  } catch (err) {
    console.error(err);
    return new NextResponse("Webhook error", { status: 500 });
  }

  return NextResponse.json({ received: true });
}

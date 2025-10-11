import { z } from "zod";

const envSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET is required"),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  EMAIL_FROM: z.string().min(1, "EMAIL_FROM is required"),
  SHOP_OWNER_EMAIL: z.string().email(),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(6, "ADMIN_PASSWORD should be at least 6 characters"),
});

const parsed = envSchema.safeParse({
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  SHOP_OWNER_EMAIL: process.env.SHOP_OWNER_EMAIL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
});

if (!parsed.success) {
  const message = parsed.error.errors
    .map((e) => `${e.path.join(".")}: ${e.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables\n${message}`);
}

export const env = parsed.data;

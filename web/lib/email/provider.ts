import { Resend } from "resend";
import { env } from "@/lib/env";

export interface EmailProvider {
  send(params: { to: string | string[]; subject: string; html: string; from?: string }): Promise<void>;
}

export class ResendProvider implements EmailProvider {
  private client: Resend;
  private from: string;
  constructor(apiKey: string, from: string) {
    this.client = new Resend(apiKey);
    this.from = from;
  }
  async send({ to, subject, html, from }: { to: string | string[]; subject: string; html: string; from?: string }) {
    await this.client.emails.send({ from: from ?? this.from, to, subject, html });
  }
}

// Future: add PostmarkProvider, MailgunProvider implementing EmailProvider

export const emailProvider: EmailProvider = new ResendProvider(env.RESEND_API_KEY, env.EMAIL_FROM);

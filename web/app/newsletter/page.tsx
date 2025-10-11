"use client";

import { useState } from "react";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "Bitte prüfen Sie Ihre E-Mail zur Bestätigung." : "Fehler beim Abonnieren");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Newsletter</h1>
      <form onSubmit={subscribe} className="mt-6 flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ihre E-Mail"
          className="flex-1 rounded-md border px-3 py-2"
        />
        <button className="rounded-full bg-black text-white px-6 py-2 text-sm">Abonnieren</button>
      </form>
      {status && <p className="text-sm text-gray-600 mt-3">{status}</p>}
    </div>
  );
}

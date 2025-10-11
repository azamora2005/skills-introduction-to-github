"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  email: z.string().email("Ungültige E-Mail"),
  rating: z.coerce.number().min(1).max(5),
  message: z.string().min(1, "Nachricht ist erforderlich"),
});

type FormValues = z.infer<typeof schema>;

export default function FeedbackPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      reset();
      alert("Danke für Ihr Feedback!");
    } else {
      alert("Fehler beim Senden");
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Feedback</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input className="mt-1 w-full rounded-md border px-3 py-2" {...register("name")} />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">E-Mail</label>
          <input className="mt-1 w-full rounded-md border px-3 py-2" {...register("email")} />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Bewertung (1–5)</label>
          <input type="number" min={1} max={5} className="mt-1 w-full rounded-md border px-3 py-2" {...register("rating", { valueAsNumber: true })} />
          {errors.rating && <p className="text-sm text-red-600 mt-1">{errors.rating.message as string}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Nachricht</label>
          <textarea className="mt-1 w-full rounded-md border px-3 py-2" rows={5} {...register("message")} />
          {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="inline-flex rounded-full bg-black text-white px-6 py-3 text-sm">Senden</button>
      </form>
    </div>
  );
}

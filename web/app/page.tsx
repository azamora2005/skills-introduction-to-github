import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight">Schweizer Käse, frisch und fein.</h1>
        <p className="mt-4 text-gray-600">Fondue & Raclette – jetzt bestellen und geniessen.</p>
        <div className="mt-8">
          <Link href="/shop" className="inline-flex rounded-full bg-black text-white px-6 py-3 text-sm">Jetzt bestellen</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border p-6 shadow-sm">
          <h3 className="font-semibold">Fondue</h3>
          <p className="text-sm text-gray-600 mt-2">Cremig, klassisch, perfekt für gemütliche Abende.</p>
        </div>
        <div className="rounded-2xl border p-6 shadow-sm">
          <h3 className="font-semibold">Raclette</h3>
          <p className="text-sm text-gray-600 mt-2">Classic, Pfeffer, Chili oder Knoblauch.</p>
        </div>
        <div className="rounded-2xl border p-6 shadow-sm">
          <h3 className="font-semibold">Lokal</h3>
          <p className="text-sm text-gray-600 mt-2">Regional produziert, frisch geliefert.</p>
        </div>
      </section>
    </div>
  );
}

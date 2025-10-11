import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatChf } from "@/lib/format";

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: true },
  });
  if (!product) return notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-[4/3] w-full rounded-2xl bg-gray-100" />
        <div>
          <h1 className="text-3xl font-semibold">{product.title}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-semibold">{formatChf(product.priceCents)}</span>
          </div>

          <form className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Variante</label>
              <select className="mt-1 w-full rounded-md border px-3 py-2">
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="rounded-full border px-3 py-1">-</button>
              <span>1</span>
              <button type="button" className="rounded-full border px-3 py-1">+</button>
            </div>
            <button type="button" className="inline-flex rounded-full bg-black text-white px-6 py-3 text-sm">In den Warenkorb</button>
          </form>

          <div className="mt-6 text-sm">
            <Link href="/shop" className="text-gray-600 hover:underline">← Zurück zum Shop</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

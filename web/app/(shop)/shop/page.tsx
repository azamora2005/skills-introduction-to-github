import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatChf } from "@/lib/format";

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { title: "asc" },
    include: { variants: true },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Shop</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.slug}`} className="rounded-2xl border p-4 hover:shadow-md transition-shadow">
            <div className="aspect-[4/3] w-full rounded-xl bg-gray-100 mb-3 overflow-hidden">
              {/* TODO: Use next/image with p.imageUrl */}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-xs text-gray-500">{p.category}</p>
              </div>
              <span className="text-sm font-medium">{formatChf(p.priceCents)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create products
  const products = [
    {
      slug: "fondue-mix-500g",
      title: "Fondue-Mix 500g",
      description: "Feine Mischung für cremiges Fondue.",
      category: "FONDUE" as const,
      imageUrl: "/images/fondue-mix.jpg",
      priceCents: 1490,
      active: true,
      variants: ["Classic"],
    },
    {
      slug: "raclette-classic-500g",
      title: "Raclette Classic 500g",
      description: "Klassischer Raclettekäse, mild und cremig.",
      category: "RACLETTE" as const,
      imageUrl: "/images/raclette-classic.jpg",
      priceCents: 1290,
      active: true,
      variants: ["Classic"],
    },
    {
      slug: "raclette-pfeffer-500g",
      title: "Raclette Pfeffer 500g",
      description: "Raclette mit Pfeffer-Note.",
      category: "RACLETTE" as const,
      imageUrl: "/images/raclette-pfeffer.jpg",
      priceCents: 1390,
      active: true,
      variants: ["Pfeffer"],
    },
    {
      slug: "raclette-chili-500g",
      title: "Raclette Chili 500g",
      description: "Raclette mit Chili-Schärfe.",
      category: "RACLETTE" as const,
      imageUrl: "/images/raclette-chili.jpg",
      priceCents: 1390,
      active: true,
      variants: ["Chili"],
    },
    {
      slug: "raclette-knoblauch-500g",
      title: "Raclette Knoblauch 500g",
      description: "Raclette mit Knoblauch-Aroma.",
      category: "RACLETTE" as const,
      imageUrl: "/images/raclette-knoblauch.jpg",
      priceCents: 1390,
      active: true,
      variants: ["Knoblauch"],
    },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        description: p.description,
        category: p.category as any,
        imageUrl: p.imageUrl,
        priceCents: p.priceCents,
        active: p.active,
      },
    });

    for (const name of p.variants) {
      await prisma.productVariant.upsert({
        where: { productId_name: { productId: product.id, name } },
        update: {},
        create: { productId: product.id, name },
      });
    }
  }

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

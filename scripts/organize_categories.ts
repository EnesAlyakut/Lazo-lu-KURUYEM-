import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Kategoriler oluşturuluyor ve ürünler düzenleniyor...");

  const categoriesToCreate = [
    {
      name: "Drajeler ve Şekerlemeler",
      slug: "drajeler-ve-sekerlemeler",
      description: "Rengarenk ve çikolata kaplı enfes draje ve şekerleme çeşitleri",
    },
    {
      name: "Soslu ve Çıtır Leblebiler",
      slug: "soslu-ve-citir-leblebiler",
      description: "Özel soslarla kaplanmış, çıtır çıtır aromalı leblebiler",
    },
    {
      name: "Geleneksel Kuruyemişler",
      slug: "geleneksel-kuruyemisler",
      description: "Çorum leblebisi, fındık, fıstık ve klasik kuruyemiş çeşitlerimiz",
    },
    {
      name: "Kuru Meyveler",
      slug: "kuru-meyveler",
      description: "Doğal yöntemlerle kurutulmuş, sağlıklı ve taptaze kuru meyve seçenekleri",
    },
    {
      name: "Lüks Karışımlar",
      slug: "luks-karisimlar",
      description: "En sevilen kuruyemiş ve drajelerin bir araya geldiği özel kokteyl karışımlar",
    },
    {
      name: "Cips ve Atıştırmalıklar",
      slug: "cips-ve-atistirmaliklar",
      description: "Çıtır cipsler, soslu fıstıklar ve keyifli tuzlu atıştırmalıklar",
    }
  ];

  const categoryMap = new Map();

  // Create or find categories
  for (const catData of categoriesToCreate) {
    const cat = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: { description: catData.description },
      create: { ...catData, image: "" },
    });
    categoryMap.set(catData.name, cat.id);
  }

  const products = await prisma.product.findMany();

  for (const product of products) {
    let targetCategory = "Geleneksel Kuruyemişler"; // Default
    const nameLower = product.name.toLowerCase();

    // Determine category based on name keywords
    if (nameLower.includes("draje") || nameLower.includes("şeker") || nameLower.includes("çikolata") || nameLower.includes("jelly") || nameLower.includes("bonibon")) {
      targetCategory = "Drajeler ve Şekerlemeler";
      // Handle edge cases like "Badem Şekeri" -> Drajeler
    } else if (nameLower.includes("cips") || nameLower.includes("mısır") || nameLower.includes("susamlı")) {
      targetCategory = "Cips ve Atıştırmalıklar";
    } else if (nameLower.includes("karışık") || nameLower.includes("kokteyl") || nameLower.includes("atom")) {
      targetCategory = "Lüks Karışımlar";
      // If it's a "draje karışımı", we want it in drajeler or karışımlar? "Drajeler" already catches it above if it has "draje".
      // Let's refine: "draje karışımı" is caught by "draje" first. That's fine.
    } else if (nameLower.includes("kuru") || nameLower.includes("erik") || nameLower.includes("dut") || nameLower.includes("turna")) {
      targetCategory = "Kuru Meyveler";
    } else if (nameLower.includes("soslu") || nameLower.includes("çıtır") || nameLower.includes("krokan") || nameLower.includes("aromalı") || nameLower.includes("taco") || nameLower.includes("peynir") || nameLower.includes("acılı") || nameLower.includes("ketçap") || nameLower.includes("yoğurt") || nameLower.includes("baharat")) {
      targetCategory = "Soslu ve Çıtır Leblebiler";
    } else {
      // Catch all traditional ones
      targetCategory = "Geleneksel Kuruyemişler"; 
    }

    // Override for specific items if logic failed
    if (nameLower.includes("krokanlı çıtır leblebi")) targetCategory = "Soslu ve Çıtır Leblebiler";
    if (nameLower.includes("kuru üzüm drajesi")) targetCategory = "Drajeler ve Şekerlemeler";
    if (nameLower.includes("karışık cips")) targetCategory = "Cips ve Atıştırmalıklar";
    if (nameLower.includes("soslu kavrulmuş mısır")) targetCategory = "Cips ve Atıştırmalıklar";

    const newCategoryId = categoryMap.get(targetCategory);

    if (product.categoryId !== newCategoryId) {
      await prisma.product.update({
        where: { id: product.id },
        data: { categoryId: newCategoryId }
      });
      console.log(`Ürün güncellendi: ${product.name} -> ${targetCategory}`);
    }
  }

  console.log("Kategori organizasyonu tamamlandı!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

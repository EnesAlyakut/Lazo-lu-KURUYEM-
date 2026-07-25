import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const imageMapping: Record<string, string> = {
  // Spesifik ürünler
  "luksleb-sade-leblebi-kurabiyesi": "/images/products/luksleb-sade-kurabiye.png",
  "luksleb-cikolatali-leblebi-kurabiyesi": "/images/products/luksleb-cikolatali-kirabiye.png",
  "buyuk-boy-ahsap-kutu-dolu": "/images/products/corum-hatirasi-ahsap-9lu-kutu.png",
  "kucuk-boy-ahsap-kutu-dolu": "/images/products/corum-hatirasi-ahsap-draje-kutu.png",
  "buyuk-boy-ahsap-kutu-bos": "/images/products/corum-hatirasi-bos-6li-kutu.png",
  "kucuk-boy-ahsap-kutu-bos": "/images/products/corum-hatirasi-bos-4lu-kutu.png",
};

async function main() {
  console.log("Ürün görselleri atanıyor ve ürünler yayına alınıyor...");

  const allProducts = await prisma.product.findMany();
  let updatedCount = 0;

  for (const product of allProducts) {
    let newImageUrl = imageMapping[product.slug];

    // Fuzzy matching for product folders
    if (!newImageUrl) {
      const slug = product.slug;
      if (slug.includes("luksleb") && slug.includes("sade")) newImageUrl = "/images/products/luksleb-sade-kurabiye.png";
      else if (slug.includes("luksleb") && slug.includes("cikolata")) newImageUrl = "/images/products/luksleb-cikolatali-kirabiye.png";
      else if (slug.includes("ahsap") && slug.includes("draje")) newImageUrl = "/images/products/corum-hatirasi-ahsap-draje-kutu.png";
      else if (slug.includes("ahsap") && slug.includes("kutu")) newImageUrl = "/images/products/corum-hatirasi-ahsap-9lu-kutu.png";
      else if (slug.includes("saat-kulesi")) newImageUrl = "/images/products/saat-kulesi-hediyelik.png";
      else if (slug.includes("gold") && slug.includes("canta")) newImageUrl = "/images/products/corum-hatirasi-gold-canta.png";
      else if (slug.includes("gold") && slug.includes("draje")) newImageUrl = "/images/products/corum-hatirasi-gold-draje-kutu.png";
      else if (slug.includes("silindir")) newImageUrl = "/images/products/corum-hatirasi-silindir-kutu.png";
      else if (slug.includes("premium-siyah")) newImageUrl = "/images/products/corum-hatirasi-premium-siyah-kutu.png";
      else if (slug.includes("siyah") && slug.includes("karisik")) newImageUrl = "/images/products/corum-hatirasi-karisik-kutu-siyah.png";
      else if (slug.includes("bos") && slug.includes("4lu")) newImageUrl = "/images/products/corum-hatirasi-bos-4lu-kutu.png";
      else if (slug.includes("bos") && slug.includes("6li")) newImageUrl = "/images/products/corum-hatirasi-bos-6li-kutu.png";
      else if (slug.includes("yatay") && slug.includes("bos")) newImageUrl = "/images/products/corum-hatirasi-bos-6li-yatay.png";
      
      // Generic match
      else if (slug.includes("antep-fistigi")) newImageUrl = "/images/antep-fistigi.jpg";
      else if (slug.includes("beyaz-leblebi")) newImageUrl = "/images/beyaz-leblebi.jpg";
      else if (slug.includes("cifte-kavrulmus")) newImageUrl = "/images/cifte-kavrulmus-leblebi.jpg";
      else if (slug.includes("sari-leblebi")) newImageUrl = "/images/sari-leblebi.jpg";
      else if (slug.includes("sekerli-leblebi") || slug.includes("renkli")) newImageUrl = "/images/sekerli-leblebi.jpg";
      else if (slug.includes("kuru-kayisi") || slug.includes("kayisi")) newImageUrl = "/images/kuru-kayisi.jpg";
      else if (slug.includes("karisik")) newImageUrl = "/images/karisik-kuruyemis.png";
      else if (slug.includes("leblebi")) newImageUrl = "/images/leblebi-urun.png"; // fallback leblebi
      else if (slug.includes("kutu") || slug.includes("hediye")) newImageUrl = "/images/hediyelik-kutu.jpg";
      else newImageUrl = "/images/karisik-kuruyemis.png"; // ultimate fallback
    }

    if (newImageUrl) {
      // JSON array of strings
      const currentImages = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
      let imgArr = Array.isArray(currentImages) ? currentImages : [];
      
      if (!imgArr.includes(newImageUrl)) {
        imgArr = [newImageUrl, ...imgArr.filter((i: string) => i !== newImageUrl)];
      }

      await prisma.product.update({
        where: { id: product.id },
        data: { 
          images: JSON.stringify(imgArr),
          isActive: true // Make it public on the site
        }
      });
      updatedCount++;
    }
  }

  console.log(`Toplam ${updatedCount} ürünün görseli güncellendi ve yayına alındı.`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

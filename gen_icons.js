const sharp = require('sharp');
const fs = require('fs');

async function generateIcons() {
  const src = 'public/images/logo.png';
  
  if (!fs.existsSync(src)) {
    console.error("Logo dosyası bulunamadı:", src);
    return;
  }

  try {
    // 1. public klasöründeki eski bozuk ikonları silelim
    ['public/favicon.ico', 'public/icon.png', 'public/apple-icon.png'].forEach(file => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });

    // 2. src/app içine yeni doğru ikonları oluşturalım
    await sharp(src).resize(192, 192).png().toFile('src/app/icon.png');
    await sharp(src).resize(180, 180).png().toFile('src/app/apple-icon.png');
    
    // Favicon.ico için genelde 32x32 kullanılır (png veya ico)
    // Next.js app folder için favicon.ico da kullanabiliriz veya public'te bırakabiliriz. 
    // public/favicon.ico oluşturacağız (tarayıcılar fallback olarak arayabilir)
    await sharp(src).resize(32, 32).png().toFile('src/app/favicon.ico');
    
    console.log("İkonlar başarıyla oluşturuldu!");
  } catch (err) {
    console.error("Hata:", err);
  }
}

generateIcons();

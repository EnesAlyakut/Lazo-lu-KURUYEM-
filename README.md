# FK Kuruyemiş E-Ticaret Platformu 🥜

Çorum leblebisi, kuruyemiş ve kuru meyve satışı için geliştirilmiş tam kapsamlı e-ticaret platformu.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docker.com)

---

## 🚀 Tek Komutla Başlatma

### Gereksinimler
- Docker Desktop ([İndir](https://www.docker.com/products/docker-desktop/))
- Git

### 1️⃣ Projeyi Klonlayın

```bash
git clone https://github.com/yourusername/fkkuruyemis.git
cd fkkuruyemis
```

### 2️⃣ Ortam Dosyasını Oluşturun

```bash
cp .env.example .env
# .env dosyasını düzenleyin (en azından JWT_SECRET değiştirin)
```

### 3️⃣ Docker ile Başlatın

```bash
docker-compose up --build
```

> 🎉 **Uygulama http://localhost:3000 adresinde çalışacak!**

### 4️⃣ Veritabanını Başlatın (İlk Kurulumda)

```bash
# Yeni terminalde:
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx tsx prisma/seed.ts
```

---

## 🔑 Admin Giriş Bilgileri

| Alan | Değer |
|------|-------|
| URL | http://localhost:3000/admin/giris |
| E-posta | admin@fkkuruyemis.com |
| Şifre | admin123 |

> ⚠️ **Production'da mutlaka şifre değiştirin!**

---

## 📁 Proje Yapısı

```
fkkuruyemis/
├── src/
│   ├── app/                    # Next.js App Router sayfaları
│   │   ├── page.tsx            # Ana sayfa
│   │   ├── urunler/            # Ürün listeleme & detay
│   │   ├── sepet/              # Sepet sayfası
│   │   ├── odeme/              # Ödeme sayfası
│   │   ├── blog/               # Blog listeleme & detay
│   │   ├── hakkimizda/         # Hakkımızda sayfası
│   │   ├── iletisim/           # İletişim sayfası
│   │   ├── admin/              # Yönetim paneli
│   │   │   ├── giris/          # Admin giriş
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── urunler/        # Ürün yönetimi
│   │   │   ├── siparisler/     # Sipariş yönetimi
│   │   │   ├── blog/           # Blog yönetimi
│   │   │   ├── kategoriler/    # Kategori yönetimi
│   │   │   └── kuponlar/       # Kupon yönetimi
│   │   └── api/                # API Routes
│   │       ├── auth/           # Kimlik doğrulama
│   │       ├── urunler/        # Ürün API'si
│   │       ├── siparis/        # Sipariş API'si
│   │       ├── kupon/          # Kupon API'si
│   │       └── newsletter/     # E-bülten API'si
│   ├── components/             # React bileşenleri
│   │   ├── layout/             # Navbar, Footer
│   │   ├── home/               # Ana sayfa bölümleri
│   │   ├── ui/                 # Paylaşılan UI bileşenleri
│   │   ├── admin/              # Admin panel bileşenleri
│   │   └── providers/          # Context providers
│   ├── store/                  # Zustand state management
│   ├── lib/                    # Yardımcı kütüphaneler
│   │   ├── prisma.ts           # Prisma client
│   │   └── email.ts            # E-posta servisi
│   └── middleware.ts           # JWT auth middleware
├── prisma/
│   ├── schema.prisma           # Veritabanı şeması
│   └── seed.ts                 # Demo veri scripti
├── public/                     # Statik dosyalar
│   └── images/                 # Görseller (logo, favicon)
├── nginx/                      # Nginx konfigürasyonu
├── Dockerfile                  # Production image
├── Dockerfile.migrate          # Migration image
├── docker-compose.yml          # Docker Compose
├── .env.example                # Ortam değişkenleri şablonu
└── README.md                   # Bu dosya
```

---

## 🛠 Teknoloji Yığını

| Teknoloji | Kullanım |
|-----------|----------|
| **Next.js 14** | Frontend + Backend (App Router) |
| **TypeScript** | Tip güvenliği |
| **Tailwind CSS** | Stil |
| **PostgreSQL** | Veritabanı |
| **Prisma ORM** | Veritabanı yönetimi |
| **Zustand** | Sepet state yönetimi |
| **JWT (jose)** | Admin kimlik doğrulama |
| **bcryptjs** | Şifre hashleme |
| **Nodemailer** | E-posta bildirimleri |
| **Cloudinary** | Görsel depolama |
| **iyzico** | Ödeme altyapısı (TR) |
| **Docker** | Containerization |
| **Nginx** | Reverse proxy (production) |

---

## ⚙️ Ortam Değişkenleri

Tüm ortam değişkenleri için `.env.example` dosyasına bakın.

### Zorunlu Değişkenler

```env
DATABASE_URL=postgresql://...
JWT_SECRET=minimum-32-karakter-gizli-anahtar
```

### Opsiyonel (Gelişmiş Özellikler)

```env
# Cloudinary - görsel yükleme için
CLOUDINARY_CLOUD_NAME=...

# iyzico - kredi kartı ödemeleri için
IYZICO_API_KEY=...
IYZICO_SECRET_KEY=...

# SMTP - e-posta bildirimleri için
SMTP_HOST=...
SMTP_USER=...
SMTP_PASS=...
```

---

## 🌐 Sayfa Yapısı

| Sayfa | URL |
|-------|-----|
| Ana Sayfa | `/` |
| Ürün Listesi | `/urunler` |
| Ürün Detay | `/urunler/[slug]` |
| Kategori Filtre | `/urunler?kategori=[slug]` |
| Sepet | `/sepet` |
| Ödeme | `/odeme` |
| Blog | `/blog` |
| Blog Yazısı | `/blog/[slug]` |
| Hakkımızda | `/hakkimizda` |
| İletişim | `/iletisim` |
| Admin | `/admin` |
| Admin Giriş | `/admin/giris` |

---

## 🚀 Production Dağıtım

### VPS / Sunucu

```bash
# 1. Sunucuya SSH bağlanın
# 2. Docker ve Docker Compose yükleyin
# 3. Projeyi klonlayın
git clone ... && cd fkkuruyemis

# 4. Ortam dosyasını düzenleyin
cp .env.example .env
nano .env  # Production değerleri girin

# 5. Nginx SSL için production profile kullanın
docker-compose --profile production up -d --build

# 6. SSL sertifikası (Let's Encrypt)
certbot certonly --standalone -d fkkuruyemis.com
# Sertifikaları ./nginx/ssl/ klasörüne kopyalayın
```

### Vercel Dağıtım

```bash
# Vercel CLI ile
npm i -g vercel
vercel --prod

# Ortam değişkenlerini Vercel dashboard'a ekleyin
# PostgreSQL için: Vercel Postgres veya Supabase kullanın
```

---

## 🗄️ Veritabanı Yönetimi

```bash
# Prisma Studio (görsel arayüz)
npx prisma studio

# Migration oluştur
npx prisma migrate dev --name migration-adi

# Migration uygula (production)
npx prisma migrate deploy

# Seed verisi
npx tsx prisma/seed.ts
```

---

## 📦 Seed Verisi

Seed scripti aşağıdakileri oluşturur:
- **1 Admin kullanıcı** (admin@fkkuruyemis.com / admin123)
- **5 Kategori** (Leblebi, Kuruyemiş, Kuru Meyve, Karışık Paket, Hediyelik Kutu)
- **8 Ürün** (gramaj varyantlarıyla birlikte)
- **3 Blog Yazısı** (SEO uyumlu)
- **2 Kupon** (HOSGELDIN10, FK50)

---

## 🎨 Özellikler

### Müşteri Özellikleri
- ✅ Ürün listeleme ve filtreleme
- ✅ Ürün detay sayfası (gramaj seçimi)
- ✅ Sepet yönetimi (LocalStorage)
- ✅ Kupon/indirim sistemi
- ✅ Çoklu ödeme yöntemi (Kredi kartı, Havale, Kapıda)
- ✅ Sipariş onay e-postası
- ✅ Ürün değerlendirme sistemi
- ✅ Blog sistemi (SEO uyumlu)
- ✅ E-bülten aboneliği
- ✅ WhatsApp iletişim butonu

### Admin Özellikleri
- ✅ JWT ile güvenli giriş
- ✅ Dashboard (istatistikler)
- ✅ Ürün yönetimi (CRUD)
- ✅ Kategori yönetimi
- ✅ Sipariş yönetimi
- ✅ Blog yönetimi (CRUD + SEO)
- ✅ E-bülten yönetimi
- ✅ Kupon yönetimi

### Teknik Özellikler
- ✅ Server-Side Rendering (SEO)
- ✅ Schema.org markup (Product, Article)
- ✅ Open Graph meta etiketleri
- ✅ Responsive tasarım (mobil uyumlu)
- ✅ Docker Compose kurulumu
- ✅ TypeScript

---

## 📝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Commit edin (`git commit -m 'feat: yeni özellik eklendi'`)
4. Push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request açın

---

## 📄 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 📞 İletişim

- **Website**: https://fkkuruyemis.com
- **E-posta**: info@fkkuruyemis.com
- **WhatsApp**: +90 555 123 45 67

---

*FK Kuruyemiş - Çorum'dan Gelen Eşsiz Lezzet 🥜*
#   f k k u r u y e m i s  
 #   f k k u r u y e m i s  
 
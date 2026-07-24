# LAZOĞLU KURUYEMİŞ

Çorum leblebisi, kuruyemiş ve hediyelik ürünler için geliştirilmiş Next.js e-ticaret sitesi.

## Teknolojiler

- Next.js 15 ve TypeScript
- Tailwind CSS
- MySQL ve Prisma
- PayTR iFrame ödeme
- Docker Compose ve Caddy
- Nodemailer, Cloudinary ve web push bildirimleri

## Yerel geliştirme

Gereksinimler: Node.js 20+ ve erişilebilir bir MySQL veritabanı.

```bash
npm install
copy .env.example .env
npx prisma generate
npx prisma migrate deploy
npm run db:init
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde açılır.

## Ortam değişkenleri

`.env.example` dosyasını `.env` olarak kopyalayın ve tüm örnek değerleri değiştirin. Özellikle şu değişkenler zorunludur:

- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `PAYTR_MERCHANT_ID`
- `PAYTR_MERCHANT_KEY`
- `PAYTR_MERCHANT_SALT`
- `SITE_DOMAIN`
- `MYSQL_PASSWORD`
- `MYSQL_ROOT_PASSWORD`

Gerçek `.env` dosyası Git tarafından yok sayılır ve depoya gönderilmez.

## Üretim kurulumu

Sunucuda Docker ve Docker Compose kurulu olmalıdır. Sunucu güvenlik duvarında TCP 80/443 ve tercihen UDP 443 açık olmalıdır.

```bash
git clone https://github.com/EnesAlyakut/lazoglukuruyemis.git
cd lazoglukuruyemis
cp .env.example .env
# .env içindeki değerleri doldurun
docker compose up -d --build
```

İlk başlangıçta Prisma migration dosyaları uygulanır. Veritabanı boşsa ürün kataloğu güvenli biçimde otomatik yüklenir. Caddy, `SITE_DOMAIN` için HTTPS sertifikasını otomatik alır.

## PayTR

PayTR bildirim adresi:

```text
https://lazoglukuruyemis.com/api/odeme/webhook
```

İlk gerçek ödeme testi tamamlanana kadar:

```env
PAYTR_TEST_MODE="1"
PAYTR_DEBUG_ON="1"
```

Canlıya geçişte her iki değer de `0` yapılmalıdır.

## Kontroller

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Sağlık kontrolü:

```text
GET /api/health
```

Bu uç nokta uygulama ile birlikte veritabanı bağlantısını da doğrular.

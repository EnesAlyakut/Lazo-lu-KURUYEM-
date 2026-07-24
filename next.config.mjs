/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  distDir: process.env.NODE_ENV === "production" ? ".next-build" : ".next",

  // Security headers
  async headers() {
    const isProduction = process.env.NODE_ENV === "production";

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: isProduction
              ? "public, max-age=31536000, immutable"
              : "no-store, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: isProduction
              ? "public, max-age=86400, stale-while-revalidate=3600"
              : "no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lazoglukuruyemis.com" },
      { protocol: "https", hostname: "www.lazoglukuruyemis.com" },
      { protocol: "https", hostname: "fkkuruyemis.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  // Prisma & bcrypt must run server-side only
  serverExternalPackages: ["@prisma/client", "bcryptjs"],

  // Disable powered-by header
  poweredByHeader: false,

  // Compression
  compress: true,

  webpack(config, { dev }) {
    if (dev) {
      config.cache = false;
    }
    return config;
  },

  // Redirect www → non-www (handled by nginx in production)
  // async redirects() { return []; },
};

export default nextConfig;

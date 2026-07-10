/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f8f6f4",
          100: "#eee8e3",
          200: "#d9cec5",
          300: "#bfaea1",
          400: "#a38c7c",
          500: "#876956",
          600: "#6c4f3f",
          700: "#553c2f",
          800: "#422d23",
          900: "#312119",
          950: "#1f140f",
        },
        amber: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        forest: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        cream: {
          50:  "#fbfaf8",
          100: "#f5f3ef",
          200: "#eae6de",
          300: "#dcd6ca",
          400: "#cec4b5",
          500: "#bea690",
        },
        navy: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          600: "#1e3a5f",
          700: "#162c4a",
          800: "#0f1e35",
          900: "#09131f",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        shimmer: "shimmer 2s infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      backgroundImage: {
        "hero-pattern": "url('/images/hero-bg.jpg')",
        "grain-texture": "url('/images/grain-texture.png')",
      },
      boxShadow: {
        warm: "0 4px 30px rgba(108, 79, 63, 0.2)",
        "warm-lg": "0 10px 60px rgba(108, 79, 63, 0.28)",
        product: "0 2px 20px rgba(0, 0, 0, 0.08)",
        "product-hover": "0 8px 40px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};

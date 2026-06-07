import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0a0f1e",
          800: "#0d1428",
          700: "#111827",
          600: "#1a2540",
          500: "#1e2d4d",
          400: "#253660",
        },
        electric: {
          500: "#3b82f6",
          400: "#60a5fa",
          300: "#93c5fd",
        },
        emerald: {
          500: "#10b981",
          400: "#34d399",
          300: "#6ee7b7",
        },
      },
    },
  },
  plugins: [],
};
export default config;

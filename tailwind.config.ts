import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9ebff",
          500: "#2878d8",
          600: "#1d66bd",
          700: "#164f94"
        },
        ink: "#152033"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(21, 32, 51, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;

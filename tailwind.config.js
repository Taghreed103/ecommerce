import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-encode)", ...fontFamily.sans],
      },
      colors: {
        main: "#0aad0a",
        light: "#f0f3f2",
        rating: "#ffc908",
      },
      boxShadow: {
        'box': 'rgba(145,158,171,.2) 0px 2px 4px -1px, rgba(145,158,171,.14) 0px 4px 5px 0px, rgba(145,158,171,.12) 0px 1px 10px 0px',
      },
    },
  },
  plugins: [],
};

export default config;

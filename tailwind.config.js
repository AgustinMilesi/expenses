/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#090D16",
        card: "#111827",
        cardLight: "#1F2937",
        primary: "#6366F1",
        emeraldCustom: "#10B981",
        amberCustom: "#F59E0B",
        roseCustom: "#F43F5E",
      },
    },
  },
  plugins: [],
};

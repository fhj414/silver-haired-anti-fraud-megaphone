/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["Arial", '"Microsoft YaHei"', '"PingFang SC"', '"Noto Sans CJK SC"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

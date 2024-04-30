/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    screens: {
      sm: "480px",
      md: "7668px",
      lg: "976px",
      xl: "1448px",
    },
    extend: {
      colors: {
        brightRed: "hsl(12, 88%, 59%)",
      },
    },
  },
  plugins: [],
};

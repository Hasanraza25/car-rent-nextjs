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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        sm: { max: "900px" },
        mobile: { max: "767px" }, // For mobile screens
        tablet: { min: "768px", max: "1499px" }, // For tablet screens
        desktop: { min: "1500px" }, // For desktop screens
      },
    },
  },
  plugins: [],
};

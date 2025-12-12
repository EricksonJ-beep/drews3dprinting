/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0077B6",
          green: "#00B4B4",
          red: "#E63946",
          light: "#F4F4F9",
          dark: "#1E1E24"
        }
      }
    }
  },
  plugins: []
};

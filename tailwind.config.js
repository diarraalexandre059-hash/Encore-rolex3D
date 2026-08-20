/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#E91E63',
          dark: '#111111',
          gold: '#D4AF37',
          gray: '#222222'
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1565C0',
        secondary: '#3498db',
        accent: '#64B5F6',
        temple: '#1976D2'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        tamil: ['Noto Sans Tamil', 'sans-serif']
      }
    },
  },
  plugins: [],
}

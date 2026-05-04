/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a00ae',
        secondary: '#3498db',
        indigo: {
          DEFAULT: '#4B0082',
          light: '#7986CB',
          base: '#3F51B5',
          dark: '#303F9F',
          deep: '#1A237E',
          50: '#E8EAF6',
          100: '#C5CAE9',
          200: '#9FA8DA',
          300: '#7986CB',
          400: '#5C6BC0',
          500: '#3F51B5',
          600: '#303F9F',
          700: '#283593',
          800: '#1A237E',
          900: '#0D1642'
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sun-blue': {
          DEFAULT: '#003366',
          dark: '#002244',
          light: '#004488',
        },
        'sun-yellow': {
          DEFAULT: '#FFB300',
          dark: '#FFA000',
          light: '#FFC107',
        },
      },
      fontFamily: {
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

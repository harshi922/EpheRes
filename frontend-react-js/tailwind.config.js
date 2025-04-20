/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#5cc689',
        'primary-dark': '#4ba975',
        'primary-light': '#7fd9a1',
        'secondary': '#e0695e',
        'gray-dark': '#333333',
        'gray-medium': '#666666',
        'gray-light': '#f9f9f9',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
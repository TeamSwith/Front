/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        '5.5xl': '1200px',
      },
      spacing: {
        '18': '4.5rem', // 4.5rem은 약 72px로, mt-18에 해당
      },
    },
  },
  plugins: [],
}


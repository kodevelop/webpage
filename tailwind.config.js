/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      textColor: {
        'kodev-blauw': '#ffffff',
        'kodev-roze': '#18457c',
        'kodev-green': '#5D775E',
      },
      backgroundColor: {
        'kodev-blue': '#0e2a4c',
        'kodev-green': '#5D775E',
        'kodev-pink': '#f4eee2',
      }
    },
  },
  plugins: [],
}


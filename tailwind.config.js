/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      textColor: {
        'de-tijd-blauw': '#ffffff',
        'de-tijd-roze': '#18457c',
      },
      backgroundColor: {
        'de-tijd-blauw': '#0e2a4c',
        'de-tijd-roze': '#f4eee2',
      }
    },
  },
  plugins: [],
}


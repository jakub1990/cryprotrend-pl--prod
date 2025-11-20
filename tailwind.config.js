/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#0d1117',
        'dark-lighter': '#1a1f2e',
        cyan: '#00e0ff',
        purple: '#7b4bff',
      },
    },
  },
  plugins: [],
};

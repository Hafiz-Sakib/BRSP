/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Hind Siliguri'", 'sans-serif'],
      },
      colors: {
        brsp: {
          ink: '#0a3631',
          green: '#00694d',
          red: '#c8283a',
        },
      },
    },
  },
  plugins: [],
};

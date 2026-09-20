/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0d0f14',
        surface: {
          DEFAULT: '#12141c',
          raised: '#1a1d28',
        },
        accent: {
          DEFAULT: '#f2b632',
          secondary: '#5f9a4a',
        },
        border: '#e8dfc7',
        text: {
          primary: '#f4f1e6',
          muted: '#b9b2a0',
        },
      },
      fontFamily: {
        display: ['"Press Start 2P"', 'cursive'],
        sans: ['"Pixelify Sans"', 'sans-serif'],
        mono: ['"Pixelify Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        surface: {
          DEFAULT: '#111111',
          raised: '#1a1a1a',
        },
        accent: {
          DEFAULT: '#6366f1',
          secondary: '#a855f7',
        },
        border: '#27272a',
        text: {
          primary: '#f4f4f5',
          muted: '#71717a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

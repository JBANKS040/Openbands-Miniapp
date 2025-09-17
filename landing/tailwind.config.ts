import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          900: '#0B1020',
          800: '#0E1428',
          700: '#111A3A',
        },
        accent: {
          500: '#5163FF',
          600: '#3D4CFF',
        },
        secondary: {
          500: '#7C5CFF',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config



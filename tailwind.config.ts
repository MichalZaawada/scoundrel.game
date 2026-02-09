import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'system-ui', 'sans-serif'],
      },
      colors: {
        dungeon: {
          900: '#0b0e1c',
          800: '#10152d',
          700: '#1a2146',
          500: '#2a3470',
          400: '#35408f',
        },
        accent: {
          200: '#a9f8d3',
          300: '#8be0ff',
          400: '#5be7c7',
          500: '#c75bff',
          600: '#ff6b6b',
        },
      },
      boxShadow: {
        panel: '0 0 0 4px rgba(63, 78, 168, 0.15)',
      },
      borderRadius: {
        panel: '16px',
      },
    },
  },
  plugins: [],
}

export default config

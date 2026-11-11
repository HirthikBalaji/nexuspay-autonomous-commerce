/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paypal: {
          dark: '#002C8A',
          DEFAULT: '#00457C',
          light: '#0079C1',
          cyan: '#00B8D9',
          gold: '#FFC439',
          accent: '#2C2E2F'
        },
        cyber: {
          bg: '#080C14',
          card: '#0D1424',
          cardHover: '#131C32',
          border: '#1E293B',
          glow: '#0079C1',
          accent: '#38BDF8',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 121, 193, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 184, 217, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './assets/app.js'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070a12',
          900: '#0b0f1a',
          800: '#111726',
          700: '#1a2236',
          600: '#28324d',
        },
        mist: {
          100: '#eef2fb',
          300: '#c4cde0',
          400: '#9aa6c2',
          500: '#6b7896',
        },
        audit: {
          // verde "AUDIT" de la marca
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        beam: {
          // azul/índigo de acento
          400: '#60a5fa',
          500: '#3b82f6',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,.04) inset, 0 24px 60px -20px rgba(0,0,0,.7)',
        cta: '0 10px 30px -8px rgba(16,185,129,.5)',
      },
      borderRadius: { xl2: '1.25rem' },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise .7s cubic-bezier(.22,1,.36,1) both',
      },
    },
  },
  plugins: [],
};

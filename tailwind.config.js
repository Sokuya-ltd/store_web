/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50:  '#FEF0DC',
          100: '#FDD8A8',
          200: '#FAC775',
          300: '#F8AA3F',
          400: '#F5820A',
          500: '#D96E06',
          600: '#C5620A',
          700: '#A04E07',
          800: '#7A3A05',
          900: '#4F2503',
        },
        navy: {
          50:  '#E8EAF0',
          100: '#C5CAD8',
          200: '#9FA8BF',
          300: '#7884A4',
          400: '#566590',
          500: '#384A7A',
          600: '#2C3A66',
          700: '#243055',
          800: '#1E2535',
          900: '#121520',
        },
        neutral: {
          0:   '#FFFFFF',
          50:  '#F5F3EE',
          100: '#EAE8E3',
          200: '#E2E0D8',
          300: '#CCCAC2',
          400: '#B0AEA6',
          500: '#9A9890',
          600: '#7A7870',
          700: '#5E5C55',
          800: '#4A4845',
          900: '#2C2C2A',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
}

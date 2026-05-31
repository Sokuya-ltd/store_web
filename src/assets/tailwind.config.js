/**
 * Sokuya Design System — Tailwind CSS v3 Config
 *
 * Usage in vite.config.js / tailwind.config.js:
 *   export { default } from './src/tailwind.config.js'
 *
 * Or merge into your root tailwind.config.js:
 *   import sokuyaTheme from './src/tailwind.config.js'
 *   export default { ...sokuyaTheme, content: ['./index.html','./src/**\/*.{js,jsx,ts,tsx}'] }
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      // ── Colors ───────────────────────────────────────────────────────────
      colors: {
        orange: {
          50:  '#FEF0DC',
          100: '#FDD8A8',
          200: '#FAC775',
          300: '#F8AA3F',
          400: '#F5820A',   // brand CTA
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
          800: '#1E2535',   // dark section bg
          900: '#121520',
        },
        neutral: {
          0:   '#FFFFFF',
          50:  '#F5F3EE',   // page bg
          100: '#EAE8E3',
          200: '#E2E0D8',   // border
          300: '#CCCAC2',
          400: '#B0AEA6',
          500: '#9A9890',   // muted text
          600: '#7A7870',
          700: '#5E5C55',
          800: '#4A4845',   // secondary text
          900: '#2C2C2A',   // primary text
        },
      },

      // ── Fonts ─────────────────────────────────────────────────────────────
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },

      // ── Font sizes ────────────────────────────────────────────────────────
      fontSize: {
        'xs':   ['0.75rem',  { lineHeight: '1rem' }],
        'sm':   ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem',     { lineHeight: '1.75rem' }],
        'lg':   ['1.125rem', { lineHeight: '1.75rem' }],
        'xl':   ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl':  ['1.5rem',   { lineHeight: '2rem' }],
        '3xl':  ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl':  ['2.25rem',  { lineHeight: '2.5rem' }],
        '5xl':  ['3rem',     { lineHeight: '1.1' }],
        '6xl':  ['3.75rem',  { lineHeight: '1.05' }],
        '7xl':  ['4.5rem',   { lineHeight: '1' }],
      },

      // ── Border radius ─────────────────────────────────────────────────────
      borderRadius: {
        'sm':   '4px',
        DEFAULT:'8px',
        'md':   '8px',
        'lg':   '12px',
        'xl':   '16px',
        '2xl':  '20px',
        '3xl':  '28px',
        'full': '9999px',
      },

      // ── Box shadows ───────────────────────────────────────────────────────
      boxShadow: {
        'sm':    '0 1px 2px 0 rgba(30, 37, 53, 0.06)',
        DEFAULT: '0 2px 8px 0 rgba(30, 37, 53, 0.10)',
        'md':    '0 4px 16px 0 rgba(30, 37, 53, 0.12)',
        'lg':    '0 8px 32px 0 rgba(30, 37, 53, 0.14)',
        'xl':    '0 16px 48px 0 rgba(30, 37, 53, 0.18)',
      },

      // ── Spacing (extends default Tailwind scale) ──────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },

      // ── Max widths ────────────────────────────────────────────────────────
      maxWidth: {
        'container': '1200px',
        'prose-lg':  '72ch',
      },

      // ── Background colors (semantic shortcuts) ────────────────────────────
      backgroundColor: ({ theme }) => ({
        'brand':        theme('colors.orange.400'),
        'brand-light':  theme('colors.orange.50'),
        'brand-hover':  theme('colors.orange.500'),
        'dark':         theme('colors.navy.800'),
        'dark-deep':    theme('colors.navy.900'),
        'page':         theme('colors.neutral.50'),
        'surface':      '#FFFFFF',
      }),

      // ── Text colors (semantic shortcuts) ─────────────────────────────────
      textColor: ({ theme }) => ({
        'brand':        theme('colors.orange.400'),
        'brand-dark':   theme('colors.orange.800'),
        'on-dark':      '#FFFFFF',
        'muted':        theme('colors.neutral.500'),
      }),

      // ── Border colors ─────────────────────────────────────────────────────
      borderColor: ({ theme }) => ({
        'brand':        theme('colors.orange.400'),
        'default':      theme('colors.neutral.200'),
        'strong':       theme('colors.neutral.300'),
      }),

      // ── Transitions ───────────────────────────────────────────────────────
      transitionDuration: {
        'fast': '150ms',
        DEFAULT:'200ms',
        'slow': '350ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'ease',
      },
    },
  },

  plugins: [],
};

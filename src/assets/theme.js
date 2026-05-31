/**
 * Sokuya Design System — Theme Tokens
 * Generated from brand reference (sokuya.com)
 *
 * Usage:
 *   import { colors, typography, spacing, radii, shadows } from './theme'
 */

export const colors = {
  // ─── Brand ───────────────────────────────────────────────────────────
  orange: {
    50:  '#FEF0DC',
    100: '#FDD8A8',
    200: '#FAC775',
    300: '#F8AA3F',
    400: '#F5820A', // ← Core brand orange (CTAs, accents, highlights)
    500: '#D96E06',
    600: '#C5620A',
    700: '#A04E07',
    800: '#7A3A05',
    900: '#4F2503',
  },

  // ─── Dark / Navy ──────────────────────────────────────────────────────
  navy: {
    50:  '#E8EAF0',
    100: '#C5CAD8',
    200: '#9FA8BF',
    300: '#7884A4',
    400: '#566590',
    500: '#384A7A',
    600: '#2C3A66',
    700: '#243055',
    800: '#1E2535', // ← Dark section bg (nav, footer, feature blocks)
    900: '#121520',
  },

  // ─── Neutrals (warm-tinted grays) ────────────────────────────────────
  neutral: {
    0:   '#FFFFFF',
    50:  '#F5F3EE', // ← Page background (warm off-white)
    100: '#EAE8E3',
    200: '#E2E0D8', // ← Border color
    300: '#CCCAC2',
    400: '#B0AEA6',
    500: '#9A9890', // ← Muted / placeholder text
    600: '#7A7870',
    700: '#5E5C55',
    800: '#4A4845', // ← Secondary text
    900: '#2C2C2A', // ← Primary text (charcoal)
  },

  // ─── Semantic ─────────────────────────────────────────────────────────
  success: {
    light: '#D1FAE5',
    DEFAULT: '#10B981',
    dark: '#065F46',
  },
  warning: {
    light: '#FEF3C7',
    DEFAULT: '#F59E0B',
    dark: '#78350F',
  },
  error: {
    light: '#FEE2E2',
    DEFAULT: '#EF4444',
    dark: '#7F1D1D',
  },
  info: {
    light: '#DBEAFE',
    DEFAULT: '#3B82F6',
    dark: '#1E3A8A',
  },
};

// ─── Typography ──────────────────────────────────────────────────────────────
export const typography = {
  fontFamily: {
    sans:    ['Inter', 'system-ui', 'sans-serif'],
    display: ['Sora', 'Inter', 'sans-serif'],  // matches Sokuya's bold heading style
    mono:    ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs:   ['0.75rem',  { lineHeight: '1rem' }],
    sm:   ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem',     { lineHeight: '1.75rem' }],
    lg:   ['1.125rem', { lineHeight: '1.75rem' }],
    xl:   ['1.25rem',  { lineHeight: '1.75rem' }],
    '2xl':['1.5rem',   { lineHeight: '2rem' }],
    '3xl':['1.875rem', { lineHeight: '2.25rem' }],
    '4xl':['2.25rem',  { lineHeight: '2.5rem' }],
    '5xl':['3rem',     { lineHeight: '1.1' }],
    '6xl':['3.75rem',  { lineHeight: '1.05' }],
  },
  fontWeight: {
    regular: '400',
    medium:  '500',
    semibold:'600',
    bold:    '700',
    black:   '900',
  },
};

// ─── Spacing ─────────────────────────────────────────────────────────────────
export const spacing = {
  0:    '0px',
  1:    '4px',
  2:    '8px',
  3:    '12px',
  4:    '16px',
  5:    '20px',
  6:    '24px',
  8:    '32px',
  10:   '40px',
  12:   '48px',
  16:   '64px',
  20:   '80px',
  24:   '96px',
  32:   '128px',
};

// ─── Border Radius ───────────────────────────────────────────────────────────
export const radii = {
  none:    '0px',
  sm:      '4px',
  DEFAULT: '8px',
  md:      '8px',
  lg:      '12px',
  xl:      '16px',
  '2xl':   '20px',
  '3xl':   '28px',
  full:    '9999px',
};

// ─── Shadows ─────────────────────────────────────────────────────────────────
export const shadows = {
  none: 'none',
  sm:   '0 1px 2px 0 rgba(30, 37, 53, 0.06)',
  DEFAULT:'0 2px 8px 0 rgba(30, 37, 53, 0.10)',
  md:   '0 4px 16px 0 rgba(30, 37, 53, 0.12)',
  lg:   '0 8px 32px 0 rgba(30, 37, 53, 0.14)',
  xl:   '0 16px 48px 0 rgba(30, 37, 53, 0.18)',
};

// ─── Z-Index ─────────────────────────────────────────────────────────────────
export const zIndex = {
  behind:  '-1',
  base:    '0',
  above:   '10',
  overlay: '20',
  modal:   '30',
  toast:   '40',
  tooltip: '50',
};

// ─── Transitions ─────────────────────────────────────────────────────────────
export const transitions = {
  fast:    '150ms ease',
  DEFAULT: '200ms ease',
  slow:    '350ms ease',
};

// ─── Breakpoints ─────────────────────────────────────────────────────────────
export const screens = {
  sm:  '640px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
  '2xl':'1536px',
};

// ─── Semantic aliases (use these in components) ───────────────────────────────
export const semantic = {
  bg: {
    page:        colors.neutral[50],      // warm off-white page bg
    surface:     colors.neutral[0],       // card / modal bg
    dark:        colors.navy[800],        // dark section bg
    darkDeep:    colors.navy[900],        // footer bg
    brand:       colors.orange[400],      // CTA / brand bg
    brandLight:  colors.orange[50],       // chip / tag bg
  },
  text: {
    primary:     colors.neutral[900],     // headings, body
    secondary:   colors.neutral[800],     // supporting text
    muted:       colors.neutral[500],     // captions, placeholders
    onDark:      colors.neutral[0],       // text on navy backgrounds
    brand:       colors.orange[400],      // accent words in headings
    brandDark:   colors.orange[800],      // text on orange-tinted bg
  },
  border: {
    DEFAULT:     colors.neutral[200],
    strong:      colors.neutral[300],
    brand:       colors.orange[400],
  },
};

export default {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  zIndex,
  transitions,
  screens,
  semantic,
};

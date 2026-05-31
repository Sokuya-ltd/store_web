/**
 * Sokuya — useTheme hook
 *
 * Provides typed access to theme tokens inside React components.
 *
 * Usage:
 *   import { useTheme } from './useTheme'
 *
 *   function MyComponent() {
 *     const { colors, semantic } = useTheme()
 *     return <div style={{ color: colors.orange[400] }}>Hello</div>
 *   }
 */

import theme from './theme';

export function useTheme() {
  return theme;
}

/**
 * Convenience: get a single color by dot path.
 *
 * getColor('orange.400')   → '#F5820A'
 * getColor('neutral.900')  → '#2C2C2A'
 * getColor('navy.800')     → '#1E2535'
 */
export function getColor(path) {
  const [ramp, stop] = path.split('.');
  return theme.colors[ramp]?.[stop] ?? null;
}

export default useTheme;

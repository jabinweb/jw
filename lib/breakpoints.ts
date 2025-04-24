// Breakpoint definitions in pixels
export const breakpoints = {
  sm: 320,  // Mobile
  md: 768,  // Tablet
  lg: 1024, // Desktop
  xl: 1200, // Large Desktop
} as const;

// Media query helper functions
export const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
} as const;
import { useState, useEffect } from 'react';

/**
 * Hook for detecting mobile viewport based on screen width.
 *
 * Uses ResizeObserver to track viewport changes and returns a boolean
 * indicating if the current viewport is below the specified breakpoint.
 * Returns `false` during SSR to avoid hydration mismatches.
 *
 * @param breakpoint - Width threshold in pixels. @defaultValue 768
 * @returns `true` if viewport width is below breakpoint, `false` otherwise
 *
 * @example
 * ```tsx
 * function ResponsiveLayout() {
 *   const isMobile = useIsMobile();
 *
 *   return isMobile ? <MobileNav /> : <DesktopNav />;
 * }
 * ```
 *
 * @example
 * Custom breakpoint:
 * ```tsx
 * const isTablet = useIsMobile(1024);
 * ```
 *
 * @category Hooks
 */
export function useIsMobile(breakpoint = 768) {
  // undefined during SSR to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < breakpoint);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, [breakpoint]);

  // Return false as default during SSR, actual value after hydration
  return isMobile ?? false;
}

import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = new Map<string, number>();

/**
 * Saves and restores scroll position for a scrollable container
 * keyed by the current route pathname.
 */
export function useScrollRestoration(
  containerRef: React.RefObject<HTMLElement | null>
) {
  const location = useLocation();
  const pathRef = useRef(location.pathname);

  // Save scroll position when navigating away
  useEffect(() => {
    const currentPath = pathRef.current;

    return () => {
      const el = containerRef.current;
      if (el) {
        scrollPositions.set(currentPath, el.scrollTop);
      }
    };
  }, [containerRef]);

  // Update path ref when location changes
  useEffect(() => {
    pathRef.current = location.pathname;
  }, [location.pathname]);

  // Restore scroll position when mounting / navigating back
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const saved = scrollPositions.get(location.pathname);
    if (saved !== undefined) {
      // Use rAF to ensure the DOM has rendered before scrolling
      requestAnimationFrame(() => {
        el.scrollTop = saved;
      });
    }
  }, [location.pathname, containerRef]);

  const savePosition = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      scrollPositions.set(location.pathname, el.scrollTop);
    }
  }, [containerRef, location.pathname]);

  return { savePosition };
}

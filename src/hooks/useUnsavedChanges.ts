import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Custom hook to protect against accidental loss of unsaved changes.
 *
 * - Intercepts browser refresh / tab close via the `beforeunload` event.
 * - Intercepts in-app navigation by monkey-patching `navigate` and tracking
 *   blocked attempts, since `useBlocker` requires a Data Router.
 *
 * @param isDirty – Whether the form currently has unsaved modifications.
 * @returns An object with:
 *  - `isBlocked` – whether a navigation attempt is currently blocked
 *  - `proceed` – allow the blocked navigation to continue
 *  - `reset` – cancel the blocked navigation and stay on the page
 */
export function useUnsavedChanges(isDirty: boolean) {
    const [blockedPath, setBlockedPath] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // ── Browser refresh / tab close guard ────────────────────────────────
    useEffect(() => {
        if (!isDirty) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    // ── Intercept link clicks for in-app navigation ─────────────────────
    useEffect(() => {
        if (!isDirty) return;

        const handleClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest("a");
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (!href || href.startsWith("http") || href.startsWith("mailto:")) return;

            // Same page – ignore
            if (href === location.pathname) return;

            // Block the navigation
            e.preventDefault();
            e.stopPropagation();
            setBlockedPath(href);
        };

        // Capture phase ensures we intercept before React Router handles it
        document.addEventListener("click", handleClick, true);
        return () => document.removeEventListener("click", handleClick, true);
    }, [isDirty, location.pathname]);

    // ── Intercept browser back / forward buttons ────────────────────────
    useEffect(() => {
        if (!isDirty) return;

        const handlePopState = () => {
            // Push the current URL back so the user stays on the page
            window.history.pushState(null, "", window.location.href);
            setBlockedPath("__back__");
        };

        // Push an extra history entry so we can detect back navigation
        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [isDirty]);

    const proceed = useCallback(() => {
        const path = blockedPath;
        setBlockedPath(null);

        if (path && path !== "__back__") {
            // Navigate to the originally intended destination
            navigate(path);
        } else if (path === "__back__") {
            // Allow the back navigation
            window.history.back();
        }
    }, [blockedPath, navigate]);

    const reset = useCallback(() => {
        setBlockedPath(null);
    }, []);

    return {
        isBlocked: blockedPath !== null,
        proceed,
        reset,
    };
}

import React, { useEffect, useMemo, useState } from "react";

type QRScanPreviewProps = {
  value: string;
  className?: string;
};

/**
 * Lightweight, memoized QR scan preview simulator.
 * - Fade + slide-up entrance
 * - Skeleton shimmer for quick updates
 * - Graceful empty state
 */
function QRScanPreview({ value, className = "" }: QRScanPreviewProps) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Entrance animation when component mounts or when a new non-empty value appears
    setVisible(true);
  }, []);

  useEffect(() => {
    // Show a short shimmer while the value updates to simulate a quick preview
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 220);
    return () => clearTimeout(t);
  }, [value]);

  const destination = useMemo(() => value || "", [value]);

  return (
    <div
      className={`w-full max-w-md mx-auto ${className}`}
      aria-live="polite"
    >
      <div
        className={`transform transition-all duration-200 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Scan Preview</h3>
              <p className="text-xs text-muted-foreground mt-1">This QR will open:</p>
            </div>
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="h-12 rounded-md bg-muted/40 overflow-hidden relative">
                <div className="absolute -left-1/2 w-[200%] inset-y-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>
            ) : destination ? (
              <a
                href={destination}
                target="_blank"
                rel="noreferrer noopener"
                className="block w-full truncate text-sm text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-md px-3 py-3 transition-transform duration-200 hover:scale-[1.01]"
                title={destination}
              >
                {destination}
              </a>
            ) : (
              <div className="h-12 rounded-md border border-dashed border-border flex items-center justify-center text-sm text-muted-foreground">Enter a URL or text to preview</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(QRScanPreview);

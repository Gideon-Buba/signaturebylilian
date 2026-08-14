import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// Precomputed length of the path below (~345), rounded up with headroom so
// the dash covers it fully — avoids measuring at runtime, which would cause
// a flash of a solid (undashed) line before hydration.
const PATH_LENGTH = 360;

// A hand-drawn-style flourish that draws itself on scroll into view, like a
// pen signing under the word — echoes the flourish in the brand's own logo.
export function SignatureUnderline({ className }: { className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} aria-hidden="true" className={cn("pointer-events-none", className)}>
      <svg viewBox="0 0 340 32" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <path
          d="M4 14 C 34 30, 66 2, 100 13 S 170 27, 205 12 S 275 3, 305 15 S 330 22, 336 13"
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          data-visible={visible}
          className="signature-draw"
          style={{ "--path-length": PATH_LENGTH } as React.CSSProperties}
        />
      </svg>
    </div>
  );
}

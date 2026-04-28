"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** When true, also fades back out as the element leaves the viewport. */
  fadeOut?: boolean;
  /** Distance (px) below which the element starts faded in (so cards mid-screen on load aren't dim). */
  visibleOnLoad?: boolean;
}

/**
 * Fades children in when entering viewport. With `fadeOut`, also fades
 * back out as the element leaves. Used for review cards on /client-diaries.
 */
export function FadeOnScroll({
  children,
  delay = 0,
  className = "",
  fadeOut = true,
  visibleOnLoad = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(visibleOnLoad);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => setVisible(true), delay);
          } else if (fadeOut) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, fadeOut]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  );
}

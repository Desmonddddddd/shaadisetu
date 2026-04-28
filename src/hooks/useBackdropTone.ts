"use client";

import { useEffect, useState, type RefObject } from "react";

// Sample the page behind a fixed-position element on scroll/resize and return
// "light" or "dark" so the element can flip its colour scheme. We hide the
// element while sampling (pointer-events: none + temporarily release the
// click target) so document.elementFromPoint sees what's *underneath* it.
//
// Walking up the parent chain handles the common case where the immediate
// hit is a transparent wrapper. We compute BT.601 luma on the first opaque
// background we find; <140 = dark.

export function useBackdropTone<T extends HTMLElement>(
  ref: RefObject<T | null>,
  active = true,
): "light" | "dark" {
  const [tone, setTone] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (!active) return;
    let frame = 0;

    const sample = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const prev = el.style.pointerEvents;
      el.style.pointerEvents = "none";
      const target = document.elementFromPoint(x, y);
      el.style.pointerEvents = prev;
      if (!target) return;

      let cur: Element | null = target;
      while (cur && cur !== document.body) {
        const bg = window.getComputedStyle(cur).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
          const m = bg.match(/rgba?\(([^)]+)\)/);
          if (!m) {
            setTone("light");
            return;
          }
          const [r, g, b] = m[1].split(",").map((s) => parseFloat(s.trim()));
          const luma = 0.299 * r + 0.587 * g + 0.114 * b;
          setTone((prev) => {
            const next = luma < 140 ? "dark" : "light";
            return prev === next ? prev : next;
          });
          return;
        }
        cur = cur.parentElement;
      }
      setTone("light");
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(sample);
    };

    sample();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ref, active]);

  return tone;
}

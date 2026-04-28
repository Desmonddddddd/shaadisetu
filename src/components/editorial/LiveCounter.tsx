"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  base: number;
  driftMs?: number;
  driftAmount?: number;
  format?: (n: number) => string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Counts up from 0 → base once on view, then drifts upward by ±`driftAmount`
 * every `driftMs` to give a "live" feel without being jumpy.
 */
export function LiveCounter({
  base,
  driftMs = 4500,
  driftAmount = 1,
  format,
  prefix = "",
  suffix = "",
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const [pop, setPop] = useState(false);
  const startedRef = useRef(false);
  const baseRef = useRef(base);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let driftInt: ReturnType<typeof setInterval> | null = null;

    function startDrift() {
      driftInt = setInterval(() => {
        const bump = Math.floor(Math.random() * driftAmount) + 1;
        baseRef.current = baseRef.current + bump;
        setValue(baseRef.current);
        setPop(true);
        setTimeout(() => setPop(false), 380);
      }, driftMs + Math.random() * 1500);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            const target = baseRef.current;
            const dur = 1800;
            const tick = (now: number) => {
              const t = Math.min((now - start) / dur, 1);
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(Math.round(eased * target));
              if (t < 1) requestAnimationFrame(tick);
              else {
                setValue(target);
                startDrift();
              }
            };
            requestAnimationFrame(tick);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (driftInt) clearInterval(driftInt);
    };
  }, [driftMs, driftAmount]);

  const display = format
    ? format(value)
    : `${prefix}${value.toLocaleString("en-IN")}${suffix}`;

  return (
    <span
      ref={ref}
      className={`inline-block transition-transform duration-300 ${
        pop ? "scale-[1.06]" : "scale-100"
      } ${className ?? ""}`}
    >
      {display}
    </span>
  );
}

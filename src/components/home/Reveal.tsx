"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Kalau user prefer reduced motion, langsung tampil */
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      el.classList.add("is-visible");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`nd-reveal ${className}`.trim()}>
      {children}
    </div>
  );
}
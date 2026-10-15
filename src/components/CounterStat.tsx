"use client";

import { useEffect, useRef, useState } from "react";

export function CounterStat({
  value,
  label,
  icon,
  suffix = "",
}: {
  value: number;
  label: string;
  icon: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const duration = 1500;
    const steps = 30;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [started, value]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <span className="text-3xl" aria-hidden="true">
        {icon}
      </span>
      <span className="mt-2 text-2xl font-bold text-[#b91c2c]">
        {display.toLocaleString("id-ID")}
        {suffix}
      </span>
      <span className="text-xs text-slate-600">{label}</span>
    </div>
  );
}
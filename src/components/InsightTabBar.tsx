"use client";

import type { Dispatch, SetStateAction } from "react";

export type InsightScope = "pangan" | "ikan" | "semua";

const TABS: { id: InsightScope; icon: string; label: string }[] = [
  { id: "pangan", icon: "🍚", label: "Pangan" },
  { id: "ikan", icon: "🐟", label: "Ikan" },
  { id: "semua", icon: "📊", label: "Semua" },
];

export function InsightTabBar({
  active,
  onChange,
}: {
  active: InsightScope;
  onChange: Dispatch<SetStateAction<InsightScope>>;
}) {
  return (
    <div
      className="nd-insight-tabs"
      role="tablist"
      aria-label="Kategori market insight"
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          type="button"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={`nd-insight-tab${active === tab.id ? " is-active" : ""}`}
        >
          <span aria-hidden="true">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
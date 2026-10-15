"use client";

export type FilterId = "all" | "modal" | "b2b" | "kemitraan" | "waralaba";

const FILTERS: { id: FilterId; label: string; icon: string }[] = [
  { id: "all", label: "Semua", icon: "🎯" },
  { id: "modal", label: "Tanpa Modal", icon: "💰" },
  { id: "b2b", label: "B2B", icon: "🏭" },
  { id: "kemitraan", label: "Kemitraan", icon: "🤝" },
  { id: "waralaba", label: "Waralaba", icon: "🏪" },
];

export function PeluangFilter({
  active,
  onChange,
}: {
  active: FilterId;
  onChange: (id: FilterId) => void;
}) {
  return (
    <div className="nd-peluang-filter" role="tablist" aria-label="Filter jenis peluang">
      {FILTERS.map((f) => (
        <button
          key={f.id}
          role="tab"
          type="button"
          aria-selected={active === f.id}
          onClick={() => onChange(f.id)}
          className={`nd-peluang-filter__btn${active === f.id ? " is-active" : ""}`}
        >
          <span aria-hidden="true">{f.icon}</span>
          {f.label}
        </button>
      ))}
    </div>
  );
}
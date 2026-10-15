"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type SearchBarProps = {
  defaultValue?: string;
  selectedCategory?: string;
};

export function SearchBar({
  defaultValue = "",
  selectedCategory = "",
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  /* Debounced fetch suggest */
  useEffect(() => {
    const q = value.trim();

    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/search/suggest?q=${encodeURIComponent(q)}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("suggest failed");
        const data = (await res.json()) as { items?: string[] };
        setSuggestions(data.items ?? []);
        setOpen((data.items ?? []).length > 0);
      } catch {
        /* diamkan — suggest opsional */
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [value]);

  /* Tutup dropdown kalau klik di luar */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /* Submit → push ke /search */
  const go = (q: string) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (selectedCategory) params.set("category", selectedCategory);
    router.push(`/search?${params.toString()}`);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setOpen(false);
    go(value);
  };

  return (
    <div ref={boxRef} style={{ position: "relative", maxWidth: 520 }}>
      <form action="/search" method="get" className="nd-hero-search" onSubmit={onSubmit}>
        <label className="nd-sr-only" htmlFor="nd-hero-q">
          Cari produk, toko, atau kategori
        </label>

        <span aria-hidden="true">⌕</span>

        <input
          id="nd-hero-q"
          type="search"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Cari produk, toko, atau kategori..."
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
        />

        {selectedCategory ? (
          <input type="hidden" name="category" value={selectedCategory} />
        ) : null}

        <button type="submit">Cari</button>
      </form>

      {open && suggestions.length > 0 ? (
        <ul className="nd-search-suggest" role="listbox">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => {
                  setValue(s);
                  setOpen(false);
                  go(s);
                }}
              >
                <span aria-hidden="true">🔍</span> {s}
              </button>
            </li>
          ))}
          {loading ? <li aria-hidden="true" /> : null}
        </ul>
      ) : null}
    </div>
  );
}
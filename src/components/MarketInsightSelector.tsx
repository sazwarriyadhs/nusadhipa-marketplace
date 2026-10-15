"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { InsightTabBar, type InsightScope } from "./InsightTabBar";
import {
  FISH_COMMODITIES,
  getFishByKey,
  getFishHighest,
  getFishLowest,
} from "@/lib/fish-price-data";

type Commodity = {
  key: string;
  name: string;
  unit: string;
};

type PricePoint = {
  province: string;
  city: string;
  price: number;
  date: string;
};

type RegionalData = {
  source?: string;
  generated_at?: string;
  total_provinces?: number;
  successful_provinces?: number;
  failed_provinces?: number;
  prices: PricePoint[];
  lowest: PricePoint | null;
  highest: PricePoint | null;
};

const API = "/api/market-insight";

const CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "rice", label: "Beras" },
  { id: "protein", label: "Protein" },
  { id: "spices", label: "Bumbu" },
  { id: "oil-sugar", label: "Minyak & Gula" },
] as const;

function categoryOf(name: string): string {
  const n = name.toLowerCase();

  if (n.includes("beras")) return "rice";
  if (
    n.includes("ayam") ||
    n.includes("sapi") ||
    n.includes("telur") ||
    n.includes("daging")
  ) return "protein";
  if (
    n.includes("bawang") ||
    n.includes("cabai") ||
    n.includes("cabe")
  ) return "spices";

  return "oil-sugar";
}

function unwrap(value: any): any {
  let result = value;
  for (let i = 0; i < 3; i++) {
    if (result?.data && !Array.isArray(result.data)) {
      result = result.data;
    } else {
      break;
    }
  }
  return result;
}

function normalizeCommodity(value: any): Commodity | null {
  const key = String(value?.key ?? value?.code ?? value?.slug ?? "").trim();
  const rawName = value?.name ?? value?.label;
  const name = String(
    typeof rawName === "string" || typeof rawName === "number"
      ? rawName
      : rawName?.name ?? rawName?.price_type ?? value?.price_type ?? ""
  ).trim();

  if (!key || !name) return null;

  return {
    key,
    name,
    unit: String(value?.unit ?? "kg"),
  };
}

function normalizePrice(value: any): PricePoint | null {
  const rawPrice = value?.price ?? value?.average_price ?? value?.value;
  const price = typeof rawPrice === "number"
    ? rawPrice
    : Number(String(rawPrice ?? "").replace(/[^\d]/g, ""));

  if (!Number.isFinite(price) || price <= 0) return null;

  const province = String(
    value?.province ??
    value?.province_name ??
    value?.region ??
    value?.name ??
    ""
  ).trim();

  const city = String(
    value?.city ??
    value?.city_name ??
    value?.kabupaten ??
    province
  ).trim();

  const rawDate = value?.date ?? value?.price_date ?? value?.tanggal ?? "";

  return {
    province: province || city || "Wilayah tidak diketahui",
    city: city || province || "Wilayah tidak diketahui",
    price,
    date: rawDate ? String(rawDate) : "",
  };
}

function normalizeRegional(value: any): RegionalData {
  const root = unwrap(value);
  const rawPrices = Array.isArray(root?.prices)
    ? root.prices
    : Array.isArray(root?.items)
      ? root.items
      : Array.isArray(root?.results)
        ? root.results
        : [];

  const prices = rawPrices
    .map(normalizePrice)
    .filter((p: PricePoint | null): p is PricePoint => p !== null);

  const explicitLowest = normalizePrice(root?.lowest ?? root?.lowest_price);
  const explicitHighest = normalizePrice(root?.highest ?? root?.highest_price);

  const lowest = explicitLowest ??
    (prices.length ? [...prices].sort((a, b) => a.price - b.price)[0] : null);

  const highest = explicitHighest ??
    (prices.length ? [...prices].sort((a, b) => b.price - a.price)[0] : null);

  return {
    source: typeof root?.source === "string"
      ? root.source
      : typeof root?.source?.name === "string"
        ? root.source.name
        : typeof root?.source?.price_type === "string"
          ? root.source.price_type
          : "Bank Indonesia · PIHPS",
    generated_at: root?.generated_at,
    total_provinces: root?.total_provinces,
    successful_provinces: root?.successful_provinces,
    failed_provinces: root?.failed_provinces,
    prices,
    lowest,
    highest,
  };
}

function formatRupiah(value: number | null | undefined, unit: string) {
  if (value == null || !Number.isFinite(value) || value <= 0) {
    return "Data tidak tersedia";
  }

  return `${new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)}/${unit}`;
}

function formatDate(value?: string) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function PriceCard({
  title,
  item,
  unit,
  kind,
}: {
  title: string;
  item: PricePoint | null;
  unit: string;
  kind: "low" | "high";
}) {
  const accent = kind === "low" ? "#15803d" : "#dc2626";

  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center gap-1.5">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <span className="text-xs font-medium text-slate-500">{title}</span>
      </div>

      <div className="break-words text-base font-bold leading-snug text-slate-900 sm:text-lg">
        {formatRupiah(item?.price, unit)}
      </div>

      <div className="mt-1 truncate text-xs font-semibold text-slate-700">
        {item?.city || "Data tidak tersedia"}
      </div>

      {item?.province && item.province !== item.city && (
        <div className="truncate text-xs text-slate-500">
          {item.province}
        </div>
      )}

      <div className="mt-1 text-[11px] text-slate-400">
        {item?.date
          ? formatDate(item.date) ?? "Tanggal tidak tersedia"
          : "Tanggal tidak tersedia"}
      </div>
    </div>
  );
}

/* ============================================================
   PANEL IKAN — data sample KKP
   ============================================================ */

function IkanPanel({
  selectedFish,
  onSelectFish,
}: {
  selectedFish: string;
  onSelectFish: (key: string) => void;
}) {
  const fish = getFishByKey(selectedFish) ?? FISH_COMMODITIES[0];
  const lowest = getFishLowest(fish);
  const highest = getFishHighest(fish);
  const maxPrice = Math.max(...fish.provinces.map((p) => p.price));

  return (
    <>
      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {FISH_COMMODITIES.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => onSelectFish(f.key)}
            className={`shrink-0 rounded-lg border px-2.5 py-2 text-xs transition ${
              selectedFish === f.key
                ? "border-slate-900 bg-slate-900 font-semibold text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="truncate text-sm font-semibold text-slate-800">
          {fish.name}
        </h3>
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
          Rata-rata nasional: Rp
          {new Intl.NumberFormat("id-ID").format(fish.nationalAvg)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-green-600" />
            <span className="text-xs font-medium text-slate-500">
              Harga terendah
            </span>
          </div>
          <div className="text-base font-bold text-slate-900 sm:text-lg">
            {lowest
              ? `Rp${new Intl.NumberFormat("id-ID").format(lowest.price)}/${fish.unit}`
              : "Data tidak tersedia"}
          </div>
          <div className="mt-1 truncate text-xs font-semibold text-slate-700">
            {lowest?.province ?? "-"}
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-red-600" />
            <span className="text-xs font-medium text-slate-500">
              Harga tertinggi
            </span>
          </div>
          <div className="text-base font-bold text-slate-900 sm:text-lg">
            {highest
              ? `Rp${new Intl.NumberFormat("id-ID").format(highest.price)}/${fish.unit}`
              : "Data tidak tersedia"}
          </div>
          <div className="mt-1 truncate text-xs font-semibold text-slate-700">
            {highest?.province ?? "-"}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h4 className="text-xs font-semibold text-slate-800">
            Sebaran harga antarprovinsi
          </h4>
          <span className="text-[10px] text-slate-400">
            {fish.provinces.length} provinsi
          </span>
        </div>
        <div className="space-y-1.5">
          {[...fish.provinces]
            .sort((a, b) => b.price - a.price)
            .slice(0, 5)
            .map((item) => (
              <div
                key={item.province}
                className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] items-center gap-2"
              >
                <span className="truncate text-[10px] text-slate-600">
                  {item.province}
                </span>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#e5232e]"
                    style={{
                      width: `${Math.min(100, (item.price / maxPrice) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-right text-[10px] font-medium text-slate-700">
                  {new Intl.NumberFormat("id-ID", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(item.price)}
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-2 text-[10px] text-slate-400">
        Sumber: KKP · Dashboard Harga Ikan (sample)
      </div>
    </>
  );
}

/* ============================================================
   PANEL SEMUA — ringkasan 4 komoditas
   ============================================================ */

function SemuaPanel() {
  const tongkol = FISH_COMMODITIES[0];

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-[10px] font-medium uppercase text-slate-400">
            🍚 Beras
          </div>
          <div className="mt-1 text-sm font-bold text-slate-900">
            Rp14.012/kg
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-[10px] font-medium uppercase text-slate-400">
            🌶️ Cabai Rawit
          </div>
          <div className="mt-1 text-sm font-bold text-slate-900">
            Rp81.268/kg
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-[10px] font-medium uppercase text-slate-400">
            🐟 {tongkol.name}
          </div>
          <div className="mt-1 text-sm font-bold text-slate-900">
            Rp{new Intl.NumberFormat("id-ID").format(tongkol.nationalAvg)}/kg
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-[10px] font-medium uppercase text-slate-400">
            🦐 Udang
          </div>
          <div className="mt-1 text-sm font-bold text-slate-900">
            Rp95.000/kg
          </div>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-slate-400">
        Gabungan data pangan strategis (PIHPS/BI) dan ikan (KKP).
        Pilih tab Pangan atau Ikan untuk detail.
      </p>
    </>
  );
}
export default function MarketInsightSelector() {
  const [scope, setScope] = useState<InsightScope>("pangan");
  const [selectedFish, setSelectedFish] = useState("tongkol");
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedKey, setSelectedKey] = useState("");
  const [regional, setRegional] = useState<RegionalData | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [listError, setListError] = useState(false);
  const [priceError, setPriceError] = useState(false);

  const visibleCommodities = useMemo(() => {
    if (activeCategory === "all") return commodities;

    return commodities.filter(
      (item) => categoryOf(item.name) === activeCategory
    );
  }, [commodities, activeCategory]);

  const selected = commodities.find((item) => item.key === selectedKey);

  const loadCommodities = useCallback(async () => {
    setLoadingList(true);
    setListError(false);

    try {
      const response = await fetch(`${API}/commodities`, {
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Gagal mengambil daftar komoditas");

      const json = await response.json();
      const root = unwrap(json);
      const rawItems = Array.isArray(root?.commodities)
        ? root.commodities
        : Array.isArray(root?.items)
          ? root.items
          : Array.isArray(root?.results)
            ? root.results
            : Array.isArray(root)
              ? root
              : [];

      const normalized = rawItems
        .map(normalizeCommodity)
        .filter((item: Commodity | null): item is Commodity => item !== null);

      setCommodities(normalized);

      setSelectedKey((current) => {
        if (current && normalized.some((item: Commodity) => item.key === current)) {
          return current;
        }
        return normalized[0]?.key ?? "";
      });

      if (!normalized.length) setListError(true);
    } catch {
      setCommodities([]);
      setSelectedKey("");
      setListError(true);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadRegional = useCallback(async (commodityKey: string) => {
    if (!commodityKey) {
      setRegional(null);
      setPriceError(true);
      return;
    }

    setLoadingPrice(true);
    setPriceError(false);
    setRegional(null);

    try {
      const response = await fetch(
        `${API}/regional-prices?commodity=${encodeURIComponent(commodityKey)}`,
        { cache: "no-store" }
      );

      if (!response.ok) throw new Error("Gagal mengambil harga regional");

      const json = await response.json();
      const result = normalizeRegional(json);

      if (!result.prices.length && !result.lowest && !result.highest) {
        setRegional(result);
        setPriceError(true);
        return;
      }

      setRegional(result);
    } catch {
      setRegional(null);
      setPriceError(true);
    } finally {
      setLoadingPrice(false);
    }
  }, []);

  useEffect(() => {
    void loadCommodities();
  }, [loadCommodities]);

  useEffect(() => {
    if (selectedKey) void loadRegional(selectedKey);
  }, [selectedKey, loadRegional]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (selectedKey) void loadRegional(selectedKey);
    }, 60_000);

    return () => window.clearInterval(timer);
  }, [selectedKey, loadRegional]);

  const maxPrice = Math.max(
    1,
    ...(regional?.prices ?? []).map((item) => item.price)
  );

  return (
    <section className="mi-panel">
      <InsightTabBar active={scope} onChange={setScope} />

      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900">
            Market Insight
          </h2>
          <p className="text-xs text-slate-500">
            Harga komoditas nasional · PIHPS
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void loadCommodities();
            if (selectedKey) void loadRegional(selectedKey);
          }}
          className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          ↻ Refresh
        </button>
      </div>

      {scope === "pangan" && (
        <>
      <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => {
              setActiveCategory(category.id);

              const first = category.id === "all"
                ? commodities[0]
                : commodities.find(
                    (item) => categoryOf(item.name) === category.id
                  );

              if (first) setSelectedKey(first.key);
            }}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              activeCategory === category.id
                ? "bg-[#e5232e] text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {loadingList ? (
          <span className="py-2 text-xs text-slate-500">
            Memuat komoditas...
          </span>
        ) : visibleCommodities.length ? (
          visibleCommodities.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSelectedKey(item.key)}
              className={`shrink-0 rounded-lg border px-2.5 py-2 text-xs transition ${
                selectedKey === item.key
                  ? "border-slate-900 bg-slate-900 font-semibold text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
              }`}
            >
              {item.name}
            </button>
          ))
        ) : (
          <span className="py-2 text-xs text-slate-500">
            {listError
              ? "Data komoditas tidak tersedia"
              : "Komoditas tidak tersedia"}
          </span>
        )}
      </div>

      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="truncate text-sm font-semibold text-slate-800">
          {selected?.name ?? "Harga komoditas"}
        </h3>

        <span className="shrink-0 text-[10px] text-slate-400">
          {loadingPrice ? "Memperbarui..." : "Pembaruan berkala"}
        </span>
      </div>

      {priceError ? (
        <div className="mi-empty-state">
          Data tidak tersedia
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <PriceCard
            title="Harga terendah"
            item={regional?.lowest ?? null}
            unit={selected?.unit ?? "kg"}
            kind="low"
          />
          <PriceCard
            title="Harga tertinggi"
            item={regional?.highest ?? null}
            unit={selected?.unit ?? "kg"}
            kind="high"
          />
        </div>
      )}

      <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-semibold text-slate-800">
              Sebaran harga antarprovinsi
            </h4>
            <p className="text-[10px] text-slate-400">
              Berdasarkan data regional yang tersedia
            </p>
          </div>
          <span className="text-[10px] text-slate-400">
            {regional?.prices.length
              ? `${regional.prices.length} wilayah`
              : ""}
          </span>
        </div>

        {priceError || !regional?.prices.length ? (
          <p className="py-2 text-xs text-slate-500">
            Data tidak tersedia
          </p>
        ) : (
          <div className="space-y-1.5">
            {[...regional.prices]
              .sort((a, b) => b.price - a.price)
              .slice(0, 5)
              .map((item) => (
                <div
                  key={`${item.province}-${item.date}`}
                  className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] items-center gap-2"
                >
                  <span className="truncate text-[10px] text-slate-600">
                    {item.province}
                  </span>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#e5232e]"
                      style={{
                        width: `${Math.min(100, (item.price / maxPrice) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-right text-[10px] font-medium text-slate-700">
                    {new Intl.NumberFormat("id-ID", {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }).format(item.price)}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-400">
        <span>
          Sumber: {regional?.source ?? "Bank Indonesia · PIHPS"}
        </span>
        <span>
          {regional?.generated_at
            ? `Diperbarui: ${formatDate(regional.generated_at) ?? "Tanggal tidak tersedia"}`
            : "Tanggal pembaruan tidak tersedia"}
        </span>
      </div>

      {typeof regional?.successful_provinces === "number" &&
        typeof regional?.total_provinces === "number" &&
        regional.successful_provinces < regional.total_provinces && (
          <p className="mt-1 text-[10px] text-amber-700">
            Data sebagian wilayah saja: {regional.successful_provinces} dari{" "}
            {regional.total_provinces} provinsi berhasil diambil.
          </p>
        )}
        </>
      )}

      {scope === "ikan" && (
        <IkanPanel
          selectedFish={selectedFish}
          onSelectFish={setSelectedFish}
        />
      )}

      {scope === "semua" && <SemuaPanel />}
    </section>
  );
}



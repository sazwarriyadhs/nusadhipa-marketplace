import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE = (
  process.env.MARKETPLACE_API_URL || "http://127.0.0.1:4002/api/v1"
).replace(/\/+$/, "");

const UPSTREAM_TIMEOUT_MS = 15_000;

type SuggestItem = {
  label: string;
  slug?: string;
  type: "product";
};

function uniqBy<T>(items: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ items: [] });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const url = new URL(`${BASE}/products`);
    url.searchParams.set("q", q);
    url.searchParams.set("limit", "6");

    const upstream = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: { accept: "application/json" },
    });

    if (!upstream.ok) {
      return NextResponse.json({ items: [] });
    }

    const raw = (await upstream.json()) as unknown;

    /* Normalisasi response */
    let list: Array<Record<string, unknown>> = [];
    if (Array.isArray(raw)) {
      list = raw as Array<Record<string, unknown>>;
    } else if (raw && typeof raw === "object") {
      const obj = raw as Record<string, unknown>;
      for (const key of ["items", "data", "results", "products", "rows"]) {
        const v = obj[key];
        if (Array.isArray(v)) {
          list = v as Array<Record<string, unknown>>;
          break;
        }
      }
    }

    /* Map + filter null dengan TYPE GUARD yang benar */
    const mapped: SuggestItem[] = [];
    for (const p of list) {
      const name = typeof p.name === "string" ? p.name : "";
      if (!name) continue;

      const slug = typeof p.slug === "string" ? p.slug : undefined;

      mapped.push({
        label: name,
        slug,
        type: "product",
      });
    }

    const items = uniqBy(mapped, (i) => i.label.toLowerCase()).slice(0, 6);

    return NextResponse.json(
      { items: items.map((i) => i.label), detailed: items },
      {
        status: 200,
        headers: { "cache-control": "no-store" },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upstream API unavailable";

    console.error("[search-suggest]", error);

    return NextResponse.json(
      {
        items: [],
        detail:
          process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 200 },
    );
  } finally {
    clearTimeout(timer);
  }
}

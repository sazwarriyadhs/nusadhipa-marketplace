import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

/* Hoist base URL — dihitung sekali saat module load */
const BASE = (
  process.env.NEXT_PUBLIC_MARKETPLACE_API_URL ||
  process.env.MARKETPLACE_API_URL ||
  "http://127.0.0.1:4000/api/v1"
).replace(/\/+$/, "");

const UPSTREAM_TIMEOUT_MS = 90_000;

async function proxy(request: Request, context: RouteContext) {
  try {
    const { path = [] } = await context.params;

    /* Tolak request tanpa segmen path */
    if (path.length === 0) {
      return NextResponse.json(
        { success: false, error: "Endpoint market insight tidak lengkap." },
        { status: 400 },
      );
    }

    const target = `${BASE}/market-insight/${path
      .map(encodeURIComponent)
      .join("/")}`;

    const url = new URL(target);
    url.search = new URL(request.url).search;

    /* Abort manual — kompatibel Node 16+ */
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

    let upstream: Response;
    try {
      upstream = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
        headers: { accept: "application/json" },
      });
    } finally {
      clearTimeout(timer);
    }

    const body = await upstream.text();

    return new Response(body, {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") ||
          "application/json; charset=utf-8",
        "cache-control": "no-store",
        "x-proxy-upstream-status": String(upstream.status),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upstream API unavailable";

    console.error("[market-insight-proxy]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Market insight API tidak dapat dihubungi.",
        detail:
          process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 502 },
    );
  }
}

export async function GET(request: Request, context: RouteContext) {
  return proxy(request, context);
}
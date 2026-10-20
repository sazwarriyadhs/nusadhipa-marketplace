const API_BASE = (
  process.env.NEXT_PUBLIC_MARKETPLACE_API_URL ||
  "https://api.nusadhipa.shop/api/v1"
).replace(/\/+$/, "");

export interface CourierRoute {
  id: number;
  route_code: string;
  area: string;
  customers: number;
  weight_kg: number;
  fee: number;
  status: "available" | "taken" | "completed";
}

export async function getAvailableRoutes(): Promise<CourierRoute[]> {
  try {
    const res = await fetch(`${API_BASE}/courier/routes`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch { return []; }
}

export async function claimRoute(routeId: number, courierId: string) {
  try {
    const res = await fetch(`${API_BASE}/courier/routes/${routeId}/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courier_id: courierId }),
    });
    const json = await res.json();
    return { success: json.success, message: json.message };
  } catch (err) { return { success: false, message: String(err) }; }
}

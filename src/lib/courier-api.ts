const API_BASE = (process.env.NEXT_PUBLIC_MARKETPLACE_API_URL || "https://api.nusadhipa.shop/api/v1").replace(/\/+$/, "");

export interface CourierRoute {
  id: number;
  route_code: string;
  area: string;
  customers: number;
  weight_kg: number;
  fee: number;
  status: "available" | "taken" | "completed";
  claimed_at?: string;
  completed_at?: string;
}

export interface CourierEarning {
  id: number;
  route_id: number;
  amount: number;
  status: "pending" | "available" | "paid";
  created_at: string;
  paid_at: string | null;
  route_code?: string;
  area?: string;
}

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export async function getAvailableRoutes(): Promise<CourierRoute[]> {
  const json = await apiFetch<{ data: CourierRoute[] }>("/courier/routes");
  return json?.data ?? [];
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

export async function completeRoute(routeId: number, courierId: string) {
  try {
    const res = await fetch(`${API_BASE}/courier/routes/${routeId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courier_id: courierId }),
    });
    const json = await res.json();
    return { success: json.success, message: json.message };
  } catch (err) { return { success: false, message: String(err) }; }
}

export async function getMyRoutes(courierId: string): Promise<CourierRoute[]> {
  const json = await apiFetch<{ data: CourierRoute[] }>(`/courier/routes/mine?courier_id=${courierId}`);
  return json?.data ?? [];
}

export async function getEarnings(courierId: string) {
  return await apiFetch<{ data: CourierEarning[]; summary: any }>(`/courier/earnings?courier_id=${courierId}`);
}

export async function getDeliveries(courierId: string): Promise<CourierRoute[]> {
  const json = await apiFetch<{ data: CourierRoute[] }>(`/courier/deliveries?courier_id=${courierId}`);
  return json?.data ?? [];
}

export function formatStock(
  value: number | string | null | undefined,
  sellingUnit?: string | null,
  salesMode?: string | null,
): string {
  const quantity = Number(value);
  if (!Number.isFinite(quantity)) return `0 ${sellingUnit?.trim() || (salesMode === "weight" ? "kg" : "unit")}`;

  const formatted = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 3,
    useGrouping: false,
  }).format(quantity);

  const unit = sellingUnit?.trim() || (salesMode === "weight" ? "kg" : "unit");
  return `${formatted} ${unit}`;
}
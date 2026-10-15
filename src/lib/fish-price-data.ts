export type FishCommodity = {
  key: string;
  name: string;
  unit: string;
  nationalAvg: number;
  provinces: { province: string; price: number }[];
};

export const FISH_COMMODITIES: FishCommodity[] = [
  {
    key: "tongkol",
    name: "Ikan Tongkol",
    unit: "kg",
    nationalAvg: 40449,
    provinces: [
      { province: "Papua Pegunungan", price: 95417 },
      { province: "Papua Tengah", price: 74167 },
      { province: "Papua Barat", price: 49333 },
      { province: "Kalimantan Tengah", price: 43846 },
      { province: "DKI Jakarta", price: 40556 },
      { province: "Jawa Barat", price: 38186 },
      { province: "Bali", price: 36944 },
      { province: "Jawa Timur", price: 34833 },
    ],
  },
  {
    key: "kembung",
    name: "Ikan Kembung",
    unit: "kg",
    nationalAvg: 42000,
    provinces: [
      { province: "Papua", price: 58000 },
      { province: "Maluku", price: 52000 },
      { province: "DKI Jakarta", price: 45000 },
      { province: "Jawa Barat", price: 42000 },
      { province: "Jawa Timur", price: 38000 },
    ],
  },
  {
    key: "layang",
    name: "Ikan Layang",
    unit: "kg",
    nationalAvg: 35000,
    provinces: [
      { province: "Papua", price: 50000 },
      { province: "NTT", price: 42000 },
      { province: "DKI Jakarta", price: 38000 },
      { province: "Jawa Tengah", price: 34000 },
      { province: "Jawa Timur", price: 32000 },
    ],
  },
  {
    key: "udang",
    name: "Udang",
    unit: "kg",
    nationalAvg: 95000,
    provinces: [
      { province: "Papua", price: 130000 },
      { province: "Kalimantan Timur", price: 110000 },
      { province: "DKI Jakarta", price: 100000 },
      { province: "Jawa Barat", price: 95000 },
      { province: "Jawa Timur", price: 85000 },
    ],
  },
  {
    key: "bandeng",
    name: "Ikan Bandeng",
    unit: "kg",
    nationalAvg: 38000,
    provinces: [
      { province: "Papua", price: 55000 },
      { province: "Kalimantan", price: 45000 },
      { province: "DKI Jakarta", price: 40000 },
      { province: "Jawa Barat", price: 37000 },
      { province: "Jawa Timur", price: 35000 },
    ],
  },
];

export function getFishByKey(key: string) {
  return FISH_COMMODITIES.find((f) => f.key === key) ?? null;
}

export function getFishLowest(fish: FishCommodity) {
  return [...fish.provinces].sort((a, b) => a.price - b.price)[0] ?? null;
}

export function getFishHighest(fish: FishCommodity) {
  return [...fish.provinces].sort((a, b) => b.price - a.price)[0] ?? null;
}
export type VendorRules = {
  id: "V-AUTO" | "V-HYBRID" | "V-MANUAL";
  priceFloor: number;       // never go below
  targetMargin: number;     // ₹ margin target (heuristic)
  deliveryFee: number;      // flat fee
  slaTier: "STANDARD" | "EXPRESS" | "PRIORITY";
  baseEta: number;          // hours
  reliability: number;      // 0..1
  stock: number;            // starting stock
  missRate: number;         // 0..1 probability to skip responding
  delayMs: { min: number; max: number }; // human/ops delay
};

export const vendorRulesTable: Record<string, VendorRules> = {
  "V-AUTO": {
    id: "V-AUTO",
    priceFloor: 469,
    targetMargin: 18,
    deliveryFee: 25,
    slaTier: "STANDARD",
    baseEta: 24,
    reliability: 0.88,
    stock: 5,
    missRate: 0.03,
    delayMs: { min: 120, max: 480 }
  },
  "V-HYBRID": {
    id: "V-HYBRID",
    priceFloor: 480,
    targetMargin: 12,
    deliveryFee: 39,
    slaTier: "EXPRESS",
    baseEta: 18,
    reliability: 0.92,
    stock: 3,
    missRate: 0.07,
    delayMs: { min: 200, max: 900 }
  },
  "V-MANUAL": {
    id: "V-MANUAL",
    priceFloor: 520,
    targetMargin: 6,
    deliveryFee: 0,
    slaTier: "PRIORITY",
    baseEta: 36,
    reliability: 0.95,
    stock: 2,
    missRate: 0.12,
    delayMs: { min: 400, max: 1400 }
  }
};

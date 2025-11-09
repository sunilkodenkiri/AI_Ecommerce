import { z } from "zod";

export const VendorId = z.enum(["V-AUTO", "V-HYBRID", "V-MANUAL", "V-RESCUE"]);
export type VendorId = z.infer<typeof VendorId>;

export const VendorSummary = z.object({
  id: VendorId,
  price: z.number().positive(),
  etaHours: z.number().int().min(0),
  reliability: z.number().min(0).max(1)
});
export type VendorSummary = z.infer<typeof VendorSummary>;

export const InventoryItem = z.object({
  productId: z.string(),
  title: z.string(),
  img: z.string().optional(),
  bestPrice: z.number().positive(),
  etaHours: z.number().int().min(0),
  reliability: z.number().min(0).max(1),
  stockQty: z.number().int().min(0),        // NEW: live stock
  vendors: z.array(VendorSummary).min(1)
});
export type InventoryItem = z.infer<typeof InventoryItem>;

export type CatalogQuery = { q?: string; sort?: "best" | "fastest" | "reliable"; limit?: number; };
export interface CatalogPort { fetch(q?: CatalogQuery): Promise<InventoryItem[]>; }

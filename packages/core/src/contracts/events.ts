import { z } from "zod";

// ── Common buyer/vendor events ────────────────────────────────────────────────
export const OfferMade = z.object({
  sessionId: z.string(),
  buyerId: z.string(),
  productId: z.string(),
  qty: z.number().int().positive(),
  price: z.number().positive()
});
export type OfferMade = z.infer<typeof OfferMade>;

// Extra vendor metadata we now attach to offers
export const VendorMeta = z.object({
  deliveryFee: z.number().min(0).optional(),
  slaTier: z.enum(["STANDARD", "EXPRESS", "PRIORITY"]).optional(),
  reliability: z.number().min(0).max(1).optional(), // 0..1
  stockSlots: z.number().int().min(0).optional()    // remaining slots for this window
});

// Enriched VendorOffer = base offer + meta
export const VendorOffer = z.object({
  sessionId: z.string(),
  vendorId: z.string(),
  price: z.number().positive(),
  etaHours: z.number().int().min(0)
}).and(VendorMeta);
export type VendorOffer = z.infer<typeof VendorOffer>;

export const BestOffer = z.object({
  sessionId: z.string(),
  vendorId: z.string(),
  price: z.number().positive()
});
export type BestOffer = z.infer<typeof BestOffer>;

// ── Other topics already used by your app ─────────────────────────────────────
export const GroupLocked = z.object({
  sessionId: z.string(),
  members: z.array(z.string()).min(1),
  totalQty: z.number().int().positive()
});
export type GroupLocked = z.infer<typeof GroupLocked>;

export const ExchangeOffer = z.object({
  sessionId: z.string(),
  exchangerId: z.string(),
  topup: z.number().min(0),
  note: z.string().optional()
});
export type ExchangeOffer = z.infer<typeof ExchangeOffer>;

export const RescueOpened = z.object({
  sessionId: z.string(),
  orderId: z.string()
});
export type RescueOpened = z.infer<typeof RescueOpened>;

export const BundleOffer = z.object({
  sessionId: z.string(),
  vendorId: z.string(),
  bundlePrice: z.number().positive()
});
export type BundleOffer = z.infer<typeof BundleOffer>;

export const ServiceOffer = z.object({
  sessionId: z.string(),
  providerId: z.string(),
  price: z.number().positive(),
  slot: z.string()
});
export type ServiceOffer = z.infer<typeof ServiceOffer>;

// Control events (optional)
export const ControlReset = z.object({
  seed: z.number().optional()
});
export type ControlReset = z.infer<typeof ControlReset>;

export const Topics = {
  OfferMade: "neg/offer.made",
  VendorOffer: "neg/vendor.offer",
  BestOffer: "neg/best.updated",
  GroupLocked: "group/locked",
  ExchangeOffer: "swap/offer",
  RescueOpened: "rescue/opened",
  BundleOffer: "bundle/offer",
  ServiceOffer: "service/offer"
} as const;

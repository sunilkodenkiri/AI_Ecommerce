import { bus, Topics } from "@ac/core";

// Vendor accepts buyer's current offer
export function vendorAcceptBuyer(params: {
  sessionId: string;
  vendorId: string;
  buyerPrice: number;
}) {
  const { sessionId, vendorId, buyerPrice } = params;
  bus.emit(Topics.VendorOffer, {
    sessionId,
    vendorId,
    price: buyerPrice,
    etaHours: 18,
    deliveryFee: 0,
    slaTier: "EXPRESS",
    reliability: 0.92
  });
}

// Vendor counters buyer (reduce or increase price a bit)
export function vendorCounter(params: {
  sessionId: string;
  vendorId: string;
  basePrice: number;
  delta?: number; // default -5
}) {
  const { sessionId, vendorId, basePrice, delta = -5 } = params;
  const price = Math.max(1, basePrice + delta);
  bus.emit(Topics.VendorOffer, {
    sessionId,
    vendorId,
    price,
    etaHours: 24,
    deliveryFee: 25,
    slaTier: "STANDARD",
    reliability: 0.9
  });
}

// Vendor rejects participation
export function vendorReject(params: {
  sessionId: string;
  vendorId: string;
  reason?: string;
}) {
  const { sessionId, vendorId, reason } = params;
  bus.emit(Topics.VendorRejected, { sessionId, vendorId, reason });
}

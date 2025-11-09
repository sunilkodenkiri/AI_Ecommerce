import { bus, Topics, VendorOffer as VendorOfferSchema, locksRegistry } from "@ac/core";
import type { AINegotiatorPort } from "@ac/core";
import type { VendorOffer as TVendorOffer } from "@ac/core";

function score(o: TVendorOffer) {
  // Lower is better: price + fee + ETA penalty + reliability penalty
  const base = o.price + (o.deliveryFee ?? 0);
  const etaPenalty = o.etaHours * 2;                  // 2 ₹ per hour
  const relPenalty = (1 - (o.reliability ?? 0.7)) * 80;
  return base + etaPenalty + relPenalty;
}

export const aiAdapter: AINegotiatorPort = {
  async computeBestOffer(sessionId) {
    let best: TVendorOffer | undefined;
    let bestScore = Number.POSITIVE_INFINITY;

    const handler = (raw: unknown) => {
      // ignore if escrow is locked
      if (locksRegistry.isLocked(sessionId)) return;

      const o = VendorOfferSchema.parse(raw);
      if (o.sessionId !== sessionId) return;

      const s = score(o);
      if (s < bestScore) {
        best = o;
        bestScore = s;
        bus.emit(Topics.BestOffer, { sessionId, vendorId: o.vendorId, price: o.price });
      }
    };

    bus.on(Topics.VendorOffer, handler);

    if (best) return { vendorId: best.vendorId, price: best.price };
    return null;
  }
};

import { bus, Topics, sim, locksRegistry } from "@ac/core";
import type { VendorPort } from "@ac/core";

let slots = 5; // capacity for demo run

export const autoVendor: VendorPort = {
  async onRFQ({ sessionId, priceHint }) {
    if (locksRegistry.isLocked(sessionId)) return;
    if (slots <= 0) return;

    setTimeout(() => {
      if (locksRegistry.isLocked(sessionId)) return;
      if (slots <= 0) return;
      slots--;

      // Aggressive mood: undercut harder
      const under = 8 + Math.floor(sim.rng() * 14);
      const price = Math.max(priceHint - under, 469);

      const etaHours = 24;
      const deliveryFee = 25;
      const slaTier = "STANDARD" as const;
      const reliability = 0.88;

      bus.emit(Topics.VendorOffer, {
        sessionId,
        vendorId: "V-AUTO",
        price,
        etaHours,
        deliveryFee,
        slaTier,
        reliability,
        stockSlots: slots
      });

      // Chaos: simulate default → rescue offer
      if (sim.settings.chaos.vendorDefault && !locksRegistry.isLocked(sessionId)) {
        setTimeout(() => {
          if (locksRegistry.isLocked(sessionId)) return;
          bus.emit(Topics.RescueOpened, { sessionId, orderId: "ORD-" + sessionId });

          const rescuePrice = Math.max(price - 10, 459);
          bus.emit(Topics.VendorOffer, {
            sessionId,
            vendorId: "V-RESCUE",
            price: rescuePrice,
            etaHours: 20,
            deliveryFee: 29,
            slaTier: "EXPRESS",
            reliability: 0.9
          });
        }, sim.latencyMs());
      }
    }, sim.latencyMs());
  }
};

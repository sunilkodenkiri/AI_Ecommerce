import { bus, Topics, sim, locksRegistry } from "@ac/core";
import type { VendorPort } from "@ac/core";

let slots = 3;

export const hybridVendor: VendorPort = {
  async onRFQ({ sessionId, priceHint }) {
    if (locksRegistry.isLocked(sessionId)) return;
    if (slots <= 0) return;

    setTimeout(() => {
      if (locksRegistry.isLocked(sessionId)) return;
      if (slots <= 0) return;

      // Balanced mood: small undercut unless hint too low
      const floor = 480;
      if (priceHint < floor) return;

      const under = 5 + Math.floor(sim.rng() * 10);
      const price = Math.max(priceHint - under, floor);

      const etaHours = 18;
      const deliveryFee = 39;
      const slaTier = "EXPRESS" as const;
      const reliability = 0.92;

      // decrement only when offer will be emitted
      slots--;

      bus.emit(Topics.VendorOffer, {
        sessionId,
        vendorId: "V-HYBRID",
        price,
        etaHours,
        deliveryFee,
        slaTier,
        reliability,
        stockSlots: slots
      });
    }, sim.latencyMs());
  }
};
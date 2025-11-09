import { bus, Topics, sim, locksRegistry } from "@ac/core";
import type { VendorPort } from "@ac/core";

let slots = 2;

export const manualVendor: VendorPort = {
  async onRFQ({ sessionId, priceHint }) {
    if (locksRegistry.isLocked(sessionId)) return;
    if (slots <= 0) return;

    setTimeout(() => {
      if (locksRegistry.isLocked(sessionId)) return;
      if (slots <= 0) return;

      // Cautious: only if buyer hint meets margin
      const minAccept = 540;
      if (priceHint < minAccept) return;
      slots--;

      const delta = 3 + Math.floor(sim.rng() * 6);
      const price = Math.max(priceHint - delta, 520);

      const etaHours = 36;
      const deliveryFee = 0;                       // Free delivery promise
      const slaTier = "PRIORITY" as const;
      const reliability = 0.95;

      bus.emit(Topics.VendorOffer, {
        sessionId,
        vendorId: "V-MANUAL",
        price,
        etaHours,
        deliveryFee,
        slaTier,
        reliability,
        stockSlots: slots
      });
    }, sim.latencyMs() + 400); // slower human-ish reply
  }
};

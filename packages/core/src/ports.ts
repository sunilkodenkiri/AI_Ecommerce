// Core ports (interfaces) used by adapters
import type { VendorSuggest, VendorOffer } from "./contracts/events";

export type RFQ = {
  sessionId: string;
  productId: string;
  qty: number;
  priceHint: number;
};

export interface VendorPort {
  /** Stable ID like V-AUTO, V-HYBRID, V-MANUAL */
  id: string;

  /** Called when a buyer/AI issues an RFQ; vendor may emit offers later */
  onRFQ(input: RFQ): Promise<void> | void;

  /** (Optional) AI can push a suggested bid (used by Hybrid) */
  onSuggest?(s: VendorSuggest): void;

  /** Utility: vendor may emit final offers through the bus outside this type */
}

/** AI Negotiator Port (minimal for the demo) */
export interface AINegotiatorPort {
  /** AI listens to VendorOffer and recomputes the current best */
  onVendorOffer(o: VendorOffer): void;
}

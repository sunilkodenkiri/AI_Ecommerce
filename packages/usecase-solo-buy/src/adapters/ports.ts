import type { SessionId, VendorId, ProductId } from "@ac/core";

export type VendorPort = {
  id: VendorId;
  onRFQ(input: { sessionId: SessionId; productId: ProductId; qty: number; priceHint: number }): Promise<void> | void;
};

export type BuyerPort = {
  makeOffer(input: { sessionId: SessionId; productId: ProductId; qty: number; price: number }): Promise<void> | void;
  recounter(input: { sessionId: SessionId; price: number }): Promise<void> | void;
};

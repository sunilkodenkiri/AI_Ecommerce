import { bus, Topics, type BuyerPort } from "@ac/core";

export const buyerAdapter: BuyerPort = {
  async makeOffer({ sessionId, productId, qty, price }) {
    bus.emit(Topics.BuyerOffer, { sessionId, productId, qty, priceHint: price });
  },
  async recountOffer({ sessionId, price }) {
    bus.emit(Topics.BuyerOffer, { sessionId, productId: "N/A", qty: 1, priceHint: price });
  },
};

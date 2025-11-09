import type { CatalogPort, CatalogQuery, InventoryItem } from "@ac/core";

const data: InventoryItem[] = [
  {
    productId: "P-ARECA-M",
    title: "Areca Palm (M)",
    img: "https://images.unsplash.com/photo-1614594959886-08ab6119f52a?q=80&w=700&auto=format&fit=crop",
    bestPrice: 549,
    etaHours: 24,
    reliability: 0.91,
    stockQty: 14,
    vendors: [
      { id: "V-AUTO",   price: 549, etaHours: 24, reliability: 0.88 },
      { id: "V-HYBRID", price: 555, etaHours: 18, reliability: 0.92 }
    ]
  },
  {
    productId: "P-MONEY-M",
    title: "Money Plant (M)",
    img: "https://images.unsplash.com/photo-1602867741967-9f0f5f3b7b28?q=80&w=700&auto=format&fit=crop",
    bestPrice: 299,
    etaHours: 20,
    reliability: 0.90,
    stockQty: 32,
    vendors: [
      { id: "V-AUTO",   price: 299, etaHours: 20, reliability: 0.88 },
      { id: "V-MANUAL", price: 309, etaHours: 36, reliability: 0.95 }
    ]
  },
  {
    productId: "P-SNAKE-M",
    title: "Snake Plant (M)",
    img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=700&auto=format&fit=crop",
    bestPrice: 799,
    etaHours: 30,
    reliability: 0.94,
    stockQty: 6,
    vendors: [
      { id: "V-MANUAL", price: 799, etaHours: 30, reliability: 0.95 },
      { id: "V-HYBRID", price: 805, etaHours: 22, reliability: 0.92 }
    ]
  }
];

export const catalogMock: CatalogPort = {
  async fetch(q?: CatalogQuery) {
    let items = [...data];
    if (q?.q) {
      const t = q.q.toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(t));
    }
    if (q?.sort === "fastest") items.sort((a,b)=>a.etaHours-b.etaHours);
    else if (q?.sort === "reliable") items.sort((a,b)=>b.reliability-a.reliability);
    else items.sort((a,b)=>a.bestPrice-b.bestPrice);
    if (q?.limit) items = items.slice(0, q.limit);
    return items;
  }
};

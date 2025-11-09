"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { InventoryItem } from "@ac/core";
import { catalogMock } from "../lib/catalog.mock";
import Sheet from "./components/Sheet";

type WithStock = InventoryItem & { stock?: number };

export default function LiveStockPage() {
  const [items, setItems] = useState<WithStock[]>([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"best" | "fastest" | "reliable">("best");
  const [openItem, setOpenItem] = useState<WithStock | null>(null);
  const [qty, setQty] = useState<number>(1);

  const params = useMemo(() => ({ q, sort, limit: 30 as const }), [q, sort]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const rows = await catalogMock.fetch(params);
      // add/derive stock if missing (demo): vendors * 8, min 1
      const withStock: WithStock[] = rows.map((r) => ({
        ...r,
        stock:
          (r as any).stock ??
          Math.max(1, Math.min(99, (r.vendors?.length ?? 1) * 8))
      }));
      if (alive) setItems(withStock);
    })();
    return () => {
      alive = false;
    };
  }, [params]);

  // When opening a card, reset qty to 1 and clamp to stock
  function openCard(it: WithStock) {
    setOpenItem(it);
    setQty(Math.min(1, it.stock ?? 1) || 1); // ensures >= 1
    setQty(1);
  }

  // badge + qty helpers
  function StockBadge({ stock }: { stock?: number }) {
    const value = typeof stock === "number" ? stock : 0;
    return (
      <div className="absolute top-2 right-2">
        <span className="px-2 py-1 text-xs font-semibold text-white/95 rounded-full
          bg-white/10 backdrop-blur-md border border-white/20 shadow-sm
          flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
          {value} in stock
        </span>
      </div>
    );
  }

  function QtyStepper({
    value,
    max,
    onChange
  }: {
    value: number;
    max: number;
    onChange: (n: number) => void;
  }) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          className="px-2 py-1 rounded bg-white/10 border hover:bg-white/20"
          aria-label="Decrease"
        >
          −
        </button>
        <input
          type="number"
          min={1}
          max={max}
          value={value}
          onChange={(e) => {
            const n = parseInt(e.target.value || "1", 10);
            if (!Number.isNaN(n)) {
              onChange(Math.max(1, Math.min(max, n)));
            }
          }}
          className="w-16 text-center px-2 py-1 rounded bg-white/10 border"
        />
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="px-2 py-1 rounded bg-white/10 border hover:bg-white/20"
          aria-label="Increase"
        >
          +
        </button>
        <span className="text-xs opacity-70">/ {max} max</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Live Stock</h1>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search plants…"
          className="px-3 py-2 rounded bg-white/10 border"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="px-2 py-2 rounded bg-white/10 border"
        >
          <option value="best">Best Value</option>
          <option value="fastest">Fastest ETA</option>
          <option value="reliable">Most Reliable</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <div
            key={it.productId}
            className="relative rounded-xl border bg-white/5 overflow-hidden hover:bg-white/10"
          >
            {/* Image */}
            {it.img ? (
              <div className="relative">
                <img
                  src={it.img}
                  alt={it.title}
                  className="w-full h-40 object-cover"
                />
                {/* top gradient for contrast */}
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
                {/* Stock badge (top-right) */}
                <StockBadge stock={it.stock} />
              </div>
            ) : (
              <div className="relative w-full h-40 bg-black/20">
                <StockBadge stock={it.stock} />
              </div>
            )}

            {/* Content */}
            <button
              onClick={() => openCard(it)}
              className="w-full text-left p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label={`Open details for ${it.title}`}
            >
              <div className="font-semibold">{it.title}</div>
              <div className="text-sm opacity-80">
                Best ₹{it.bestPrice} • {it.etaHours}h •{" "}
                {(it.reliability * 100) | 0}% rel
              </div>
              <div className="text-xs opacity-70">
                {it.vendors.length} vendor(s):{" "}
                {it.vendors.map((v) => v.id).join(", ")}
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Side Sheet */}
      <Sheet
        open={!!openItem}
        onClose={() => setOpenItem(null)}
        title={openItem?.title}
      >
        {openItem && (
          <div className="space-y-4">
            {/* Hero */}
            {openItem.img && (
              <div className="relative">
                <img
                  src={openItem.img}
                  alt={openItem.title}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent rounded-t-lg" />
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 text-xs font-semibold text-white/95 rounded-full
                    bg-white/10 backdrop-blur-md border border-white/20 shadow-sm flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                    {openItem.stock ?? 0} in stock
                  </span>
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="text-sm opacity-80">
              Best ₹{openItem.bestPrice} • {openItem.etaHours}h •{" "}
              {Math.round(openItem.reliability * 100)}% rel
            </div>
            <div className="text-xs opacity-70">
              Vendors: {openItem.vendors.map((v) => v.id).join(", ")}
            </div>

            {/* Qty stepper */}
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Quantity</div>
              <QtyStepper
                value={qty}
                max={Math.max(1, openItem.stock ?? 1)}
                onChange={setQty}
              />
            </div>

            {/* Use-case actions */}
            <div className="flex flex-wrap gap-2 pt-1">
              {(() => {
                const vendorsCsv = openItem.vendors.map((v) => v.id).join(",");
                const hint = openItem.bestPrice;
                const soloHref = `/solo?productId=${encodeURIComponent(
                  openItem.productId
                )}&qty=${qty}&hint=${hint}&vendors=${encodeURIComponent(
                  vendorsCsv
                )}`;

                return (
                  <Link
                    href={soloHref}
                    className="px-3 py-2 rounded bg-emerald-600 text-white text-sm"
                  >
                    Buy Solo
                  </Link>
                );
              })()}
              <button className="px-3 py-2 rounded bg-white/10 border text-sm opacity-70 cursor-not-allowed">
                Group Buy (soon)
              </button>
              <button className="px-3 py-2 rounded bg-white/10 border text-sm opacity-70 cursor-not-allowed">
                Exchange (soon)
              </button>
              <button className="px-3 py-2 rounded bg-white/10 border text-sm opacity-70 cursor-not-allowed">
                AI Craft (soon)
              </button>
              <button className="px-3 py-2 rounded bg-white/10 border text-sm opacity-70 cursor-not-allowed">
                Maintenance (soon)
              </button>
            </div>

            {/* Vendor preview list */}
            <div className="mt-2 text-xs space-y-1 opacity-80">
              {openItem.vendors.map((v) => (
                <div
                  key={v.id}
                  className="flex justify-between bg-black/10 p-2 rounded"
                >
                  <span>{v.id}</span>
                  <span>
                    ₹{v.price} • {v.etaHours}h • {Math.round(v.reliability * 100)}
                    %
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { bus, Topics } from "@ac/core";
import { useSoloStore } from "../store/useSoloStore";
import { aiAdapter } from "../adapters/ai.adapter";

const textColor: Record<string, string> = {
  "V-AUTO":   "text-emerald-400",
  "V-HYBRID": "text-indigo-400",
  "V-MANUAL": "text-amber-400",
  "V-RESCUE": "text-rose-400"
};

export default function AIPanel() {
  const { sessions, activeSessionId, setBest, addOffer } = useSoloStore();
  const [log, setLog] = useState<{ v?: string; line: string }[]>([]);

  useEffect(() => {
    const hOffer = (p: any) => {
      if (!p?.sessionId) return;
      addOffer(p.sessionId, {
        vendorId: p.vendorId, price: p.price, etaHours: p.etaHours,
        deliveryFee: p.deliveryFee, slaTier: p.slaTier, reliability: p.reliability
      });
      if (p.sessionId === activeSessionId) {
        setLog((l) => [
          { v: p.vendorId, line: `₹${p.price} (+₹${p.deliveryFee ?? 0} fee, ${p.etaHours}h, ${p.slaTier ?? "STANDARD"}, rel ${Math.round((p.reliability ?? 0.8) * 100)}%)` },
          ...l
        ]);
      }
    };
    const hBest = (p: any) => {
      if (!p?.sessionId) return;
      setBest(p.sessionId, { vendorId: p.vendorId, price: p.price, etaHours: 24 });
      if (p.sessionId === activeSessionId) {
        setLog((l) => [{ v: p.vendorId, line: `Best → ₹${p.price}` }, ...l]);
      }
    };
    const hRescue = (p: any) => {
      if (p.sessionId === activeSessionId) setLog((l) => [{ line: `⚠ Vendor default → Rescue opened (${p.orderId})` }, ...l]);
    };

    bus.on(Topics.VendorOffer, hOffer);
    bus.on(Topics.BestOffer, hBest);
    bus.on(Topics.RescueOpened, hRescue);

    Object.keys(sessions).forEach((sid) => aiAdapter.computeBestOffer(sid));

    return () => {
      bus.off(Topics.VendorOffer, hOffer);
      bus.off(Topics.BestOffer, hBest);
      bus.off(Topics.RescueOpened, hRescue);
    };
  }, [sessions, activeSessionId, addOffer, setBest]);

  const activeBest = useSoloStore((s) => s.sessions[s.activeSessionId]?.best);

  return (
    <div className="p-4 border rounded-lg bg-white/5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold mb-1">AI Panel — Active: {activeSessionId || "—"}</h3>
      </div>

      <div className="text-xs opacity-80 mb-2">
        AI considers: price + fee + ETA penalty − reliability penalty
      </div>

      <div className="text-sm mb-2">
        Best (active): {activeBest ? `₹${activeBest.price} (${activeBest.vendorId})` : "—"}
      </div>

      <div className="text-sm font-medium mb-1">Timeline (active)</div>
      <div className="text-xs h-40 overflow-auto bg-black/10 p-2 rounded space-y-1">
        {log.map((e, i) => (
          <div key={i} className={e.v ? textColor[e.v] ?? "" : ""}>
            {e.v ? `${e.v}: ` : ""}{e.line}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useMemo, useState } from "react";
import { useSoloStore, type Offer, type VendorMode } from "../store/useSoloStore";
import { bus, Topics } from "@ac/core";

const colorOf: Record<string, string> = {
  "V-AUTO":   "border-emerald-500 ring-emerald-400/60",
  "V-HYBRID": "border-indigo-500 ring-indigo-400/60",
  "V-MANUAL": "border-amber-500 ring-amber-400/60",
  "V-RESCUE": "border-rose-500 ring-rose-400/60"
};

export default function VendorPanel() {
  const { sessions, activeSessionId, setVendorMode } = useSoloStore();
  const ses = sessions[activeSessionId];

  if (!ses) return (
    <div className="p-4 border rounded-lg bg-white/5">
      <h3 className="font-semibold mb-2">Vendor Panel</h3>
      <div className="text-sm opacity-70">No active session.</div>
    </div>
  );

  return (
    <div className="p-4 border rounded-lg bg-white/5">
      <h3 className="font-semibold mb-2">Vendors (session {activeSessionId})</h3>
      <div className="grid md:grid-cols-1 gap-3">
        {ses.vendorPool.map(vId => (
          <VendorCard
            key={vId}
            sessionId={ses.sessionId}
            vendorId={vId}
            mode={ses.vendorStates[vId]?.mode ?? "AUTO"}
            latest={ses.vendorStates[vId]?.latest}
            onMode={(m) => setVendorMode(ses.sessionId, vId, m)}
          />
        ))}
      </div>
    </div>
  );
}

function VendorCard({
  sessionId, vendorId, mode, latest, onMode
}: { sessionId: string; vendorId: string; mode: VendorMode; latest?: Offer; onMode: (m: VendorMode) => void; }) {
  const st = useSoloStore();
  const ses = st.sessions[sessionId];
  const [localPrice, setLocalPrice] = useState<number>(latest?.price ?? Math.max(420, ses.buyerPrice - 5));

  const cls = useMemo(() => colorOf[vendorId] ?? "border-slate-500 ring-slate-400/60", [vendorId]);

  // Emit a vendor offer (this simulates Accept/Counter)
  function emitOffer(price: number) {
    if (ses.escrowLocked) return;
    const base: Offer = {
      vendorId, price,
      etaHours: mode === "AUTO" ? 24 : mode === "HYBRID" ? 18 : 36,
      deliveryFee: mode === "MANUAL" ? 0 : mode === "HYBRID" ? 39 : 25,
      slaTier: mode === "HYBRID" ? "EXPRESS" : mode === "MANUAL" ? "PRIORITY" : "STANDARD",
      reliability: mode === "MANUAL" ? 0.95 : mode === "HYBRID" ? 0.92 : 0.88
    };
    bus.emit(Topics.VendorOffer, { sessionId, ...base });
  }

  function accept() {
    // Accept = meet buyer price (or improve a bit)
    const p = Math.max(400, ses.buyerPrice - (mode === "AUTO" ? 8 : mode === "HYBRID" ? 5 : 3));
    setLocalPrice(p);
    emitOffer(p);
  }

  function counter() {
    // Counter = move slightly from latest or hint
    const start = latest?.price ?? ses.buyerPrice;
    const p = Math.max(400, start - (mode === "AUTO" ? 6 : mode === "HYBRID" ? 4 : 2));
    setLocalPrice(p);
    emitOffer(p);
  }

  function reject() {
    // Reject = emit nothing; just add a line in AI via a harmless low-probability no-op (optional)
    // Here we just do nothing UI-wise; AI timeline still reflects new Best when others bid.
  }

  return (
    <div className={`p-3 rounded-lg border bg-black/10 ring-1 ${cls}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">{vendorId}</div>
        <select value={mode} onChange={(e) => onMode(e.target.value as VendorMode)}
                className="px-2 py-1 rounded bg-white/10 border text-xs">
          <option value="AUTO">Auto</option>
          <option value="HYBRID">Hybrid</option>
          <option value="MANUAL">Manual</option>
          <option value="HUMAN">Human</option>
        </select>
      </div>

      <div className="text-xs opacity-80 mb-2">
        {latest ? (
          <>Last: ₹{latest.price} • {latest.etaHours}h • {latest.slaTier ?? "STANDARD"} • Fee ₹{latest.deliveryFee ?? 0} • Rel {Math.round((latest.reliability ?? 0.9)*100)}%</>
        ) : (
          <>No offer yet.</>
        )}
      </div>

      {/* Human mode: allow typing a price; others use computed values but still editable */}
      <div className="flex items-center gap-2 mb-2">
        <label className="text-xs">Set Price</label>
        <input
          type="number"
          value={localPrice}
          onChange={(e) => setLocalPrice(parseInt(e.target.value || "0", 10))}
          className="px-2 py-1 rounded bg-white/10 border text-sm w-28"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={accept} className="px-3 py-1 rounded bg-emerald-600 text-white text-sm">Accept</button>
        <button onClick={counter} className="px-3 py-1 rounded bg-amber-600 text-white text-sm">Counter</button>
        <button onClick={reject} className="px-3 py-1 rounded bg-rose-700 text-white text-sm">Reject</button>
        <button onClick={() => emitOffer(localPrice)} className="px-3 py-1 rounded bg-blue-600 text-white text-sm">
          Send {mode === "HUMAN" ? "Manual" : "Offer"}
        </button>
      </div>
    </div>
  );
}

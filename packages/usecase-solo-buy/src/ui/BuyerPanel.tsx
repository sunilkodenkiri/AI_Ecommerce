"use client";
import { useState } from "react";
import { useSoloStore } from "../store/useSoloStore";
import { buyerAdapter } from "../adapters/buyer.adapter";
import { getVendorPort } from "../adapters/vendor.registry";

export default function BuyerPanel({ sessionId }: { sessionId: string }) {
  const st = useSoloStore();
  const ses = st.sessions[sessionId];
  const isActive = st.activeSessionId === sessionId;

  const [running, setRunning] = useState(false);
  if (!ses) return null;

  async function lockAndNegotiate() {
    st.setActive(sessionId);
    setRunning(true);
    st.setStatus(sessionId, "negotiating");
    st.clearOffers(sessionId);
    await buyerAdapter.makeOffer({ sessionId, productId: ses.productId, qty: ses.qty, price: ses.buyerPrice });
    ses.vendorPool.forEach(vId => getVendorPort(vId)?.onRFQ({ sessionId, productId: ses.productId, qty: ses.qty, priceHint: ses.buyerPrice }));
  }

  function acceptBest() {
    st.setActive(sessionId);
    if (!ses.best) return;
    st.lockEscrow(sessionId, ses.best);
  }

  async function counter() {
    st.setActive(sessionId);
    const np = Math.max(ses.buyerPrice - 5, 400);
    st.setBuyerPrice(sessionId, np);
    await buyerAdapter.recounter({ sessionId, price: np });
    ses.vendorPool.forEach(vId => getVendorPort(vId)?.onRFQ({ sessionId, productId: ses.productId, qty: ses.qty, priceHint: np }));
  }

  function rejectAll() {
    st.setActive(sessionId);
    st.setStatus(sessionId, "rejected");
    setRunning(false);
    st.clearOffers(sessionId);
  }

  return (
    <div className={["p-4 border rounded-lg bg-white/5", isActive ? "ring-2 ring-emerald-500 border-emerald-500" : ""].join(" ")}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold mb-2">Buyer {sessionId}</h3>
        {ses.escrowLocked && (
          <span className="text-xs bg-emerald-700/60 border px-2 py-0.5 rounded">
            Escrow Locked {ses.acceptedOffer ? `@ ₹${ses.acceptedOffer.price}` : ""}
          </span>
        )}
      </div>

      <div className="text-sm opacity-80 mb-2">Product: {ses.productId} • Qty {ses.qty}</div>

      <div className="flex items-center gap-2 mb-3">
        <label className="text-sm">Offer (₹):</label>
        <input
          type="number"
          value={ses.buyerPrice}
          onChange={(e) => st.setBuyerPrice(sessionId, parseInt(e.target.value || "0", 10))}
          className="px-2 py-1 rounded bg-white/10 border"
          disabled={ses.escrowLocked}
          onFocus={() => st.setActive(sessionId)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={lockAndNegotiate} disabled={running || ses.escrowLocked} className="px-3 py-1 rounded bg-emerald-600 text-white">
          {running && ses.status === "negotiating" ? "Negotiating..." : "Lock & Negotiate"}
        </button>
        <button onClick={counter} disabled={ses.escrowLocked || ses.status !== "negotiating"} className="px-3 py-1 rounded bg-amber-600 text-white">
          Counter (-₹5)
        </button>
        <button onClick={acceptBest} disabled={!ses.best || ses.escrowLocked} className="px-3 py-1 rounded bg-blue-600 text-white">
          Accept Best
        </button>
        <button onClick={rejectAll} disabled={ses.escrowLocked || ses.status === "idle"} className="px-3 py-1 rounded bg-rose-700 text-white">
          Reject
        </button>
        <button onClick={() => st.resetSession(sessionId)} className="px-3 py-1 rounded bg-slate-700 text-white">
          Reset
        </button>
      </div>
    </div>
  );
}

"use client";
import { bus, Topics, type VendorDecision } from "@ac/core";
import { useMemo } from "react";
import { useSoloStore } from "../store/useSoloStore";

export default function VendorCard({ sessionId, vendorId }: { sessionId: string; vendorId: string }) {
  const st = useSoloStore();
  const ses = st.sessions[sessionId];
  const last = useMemo(() => ses?.offers.find(o => o.vendorId === vendorId), [ses?.offers, vendorId]);
  const locked = ses?.escrowLocked;

  function emit(decision: VendorDecision) { bus.emit(Topics.VendorDecision, decision); }

  function accept() {
    if (locked) return;
    emit({ sessionId, vendorId, action: "ACCEPT" });
  }
  function reject() {
    emit({ sessionId, vendorId, action: "REJECT" });
  }
  function counter(delta: number) {
    const next = Math.max(1, (last?.price ?? ses.buyerPrice ?? 560) + delta);
    emit({ sessionId, vendorId, action: "COUNTER", counter: { price: next, etaHours: 18 } });
  }

  return (
    <div className="rounded-lg border p-3 bg-white/5">
      <div className="text-xs mb-1">{vendorId} {locked ? <span className="text-emerald-400">Locked</span> : null}</div>
      <div className="text-xs mb-2">Last: {last ? `₹${last.price} · ${last.etaHours}h` : "—"}</div>
      <div className="flex gap-2">
        <button className="btn btn-blue" onClick={accept}>Accept</button>
        <button className="btn btn-amber" onClick={() => counter(-5)}>Counter −₹5</button>
        <button className="btn btn-amber" onClick={() => counter(+5)}>Counter +₹5</button>
        <button className="btn btn-rose" onClick={reject}>Reject</button>
      </div>
    </div>
  );
}

"use client";
import { useEffect } from "react";
import BuyerPanel from "./BuyerPanel";
import AIPanel from "./AIPanel";
import VendorPanel from "./VendorPanel";
import { useSoloStore } from "../store/useSoloStore";

export default function SoloPage() {
  const { sessions, createBuyer, initialize } = useSoloStore();
  const ids = Object.keys(sessions);

  useEffect(() => {
    if (ids.length === 0) initialize(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Buyers</h3>
          <button onClick={() => createBuyer()} className="px-2 py-1 rounded bg-emerald-600 text-white text-sm">
            + Add Buyer
          </button>
        </div>
        {ids.length === 0 ? (
          <div className="text-sm opacity-70">Initializing buyers…</div>
        ) : (
          ids.map((sid) => <BuyerPanel key={sid} sessionId={sid} />)
        )}
      </div>

      <AIPanel />
      <VendorPanel />
    </div>
  );
}

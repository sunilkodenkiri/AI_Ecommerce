"use client";
import { useState } from "react";
import { useUCStore } from "../store/store";
import { bus, Topics, sim } from "@core";


export default function BuyerPanel() {
  const { sessionId, reset } = useUCStore();
  const [value, setValue] = useState(550);
  const [running, setRunning] = useState(false);
  function start() {
    setRunning(true);
    // emit a generic offer for demo
    bus.emit(Topics.OfferMade, { sessionId, buyerId: "B1", productId: "P1", qty: 1, price: value });
    // allow right panel actors to respond (handled in their adapters)
  }
  return (
    <div className="p-4 border rounded-lg bg-white/5">
      <h3 className="font-semibold mb-2">Buyer Group Panel</h3>
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm">Input:</label>
        <input type="number" value={value} onChange={(e)=>setValue(parseInt(e.target.value||"0",10))} className="px-2 py-1 rounded bg-white/10 border"/>
      </div>
      <div className="flex gap-2">
        <button onClick={start} disabled={running} className="px-3 py-1 rounded bg-emerald-600 text-white">{running? "Running…" : "Start"}</button>
        <button onClick={reset} className="px-3 py-1 rounded bg-slate-700 text-white">Reset</button>
      </div>
    </div>
  );
}

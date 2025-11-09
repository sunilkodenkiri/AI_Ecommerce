"use client";
import { useEffect } from "react";
import { bus, Topics } from "@core";
import { useUCStore } from "../store/store";

export default function AIPanel() {
  const { sessionId, addLog, setBest } = useUCStore();
  useEffect(()=>{
    const h1 = (p:any)=> addLog("OfferMade ₹"+p.price);
    const h2 = (p:any)=> { setBest(p.vendorId? (p.vendorId+" ₹"+p.price) : p.bundlePrice? ("Bundle ₹"+p.bundlePrice) : p.topup? ("Topup ₹"+p.topup) : p.price); addLog("Best updated"); };
    bus.on(Topics.OfferMade, h1);
    bus.on(Topics.BestOffer, h2);
    bus.on(Topics.BundleOffer, h2);
    bus.on(Topics.ExchangeOffer, h2);
    bus.on(Topics.ServiceOffer, h2);
    return ()=>{ bus.off(Topics.OfferMade, h1); bus.off(Topics.BestOffer, h2); bus.off(Topics.BundleOffer, h2); bus.off(Topics.ExchangeOffer, h2); bus.off(Topics.ServiceOffer, h2); };
  },[sessionId, addLog, setBest]);
  const { best, log } = useUCStore();
  return (
    <div className="p-4 border rounded-lg bg-white/5">
      <h3 className="font-semibold mb-2">AI Panel (Maintenance)</h3>
      <div className="text-sm mb-2">Best: {best || "—"}</div>
      <div className="text-sm font-medium mb-1">Timeline</div>
      <div className="text-xs h-40 overflow-auto bg-black/10 p-2 rounded">
        {log.map((l,i)=><div key={i}>{l}</div>)}
      </div>
    </div>
  );
}

"use client";
import { useEffect } from "react";
import { bus, Topics, sim } from "@core";
import { useUCStore } from "../store/store";

export default function RightPanel() {
  const { sessionId, addLog, addOffer } = useUCStore();
  useEffect(()=>{
    const onOffer = (p:any)=>{
      if(p.sessionId!==sessionId) return;
      // simulate a right-side actor replying with a better value
      setTimeout(()=>{
        const val = Math.max((p.price||600)- (10+Math.floor(Math.random()*20)), 399);
        const payload = { sessionId, vendorId: "RESCUE-VENDORS", price: val, etaHours: 24 };
        bus.emit(Topics.VendorOffer, payload);
        bus.emit(Topics.BestOffer, payload);
        addOffer({ id: "o"+Math.random().toString(36).slice(2,5), value: (payload.vendorId+" ₹"+payload.price) });
        addLog("Right-side responded");
      }, sim.latencyMs());
    };
    bus.on(Topics.OfferMade, onOffer);
    return ()=> bus.off(Topics.OfferMade, onOffer);
  },[sessionId, addLog, addOffer]);
  const { offers } = useUCStore();
  return (
    <div className="p-4 border rounded-lg bg-white/5">
      <h3 className="font-semibold mb-2">Rescue Vendors</h3>
      <div className="space-y-2">
        {offers.length===0 && <div className="text-sm opacity-70">Waiting for rescue offers…</div>}
        {offers.map(o=> <div key={o.id} className="text-sm flex justify-between bg-black/10 p-2 rounded"><span>{o.value}</span></div>)}
      </div>
    </div>
  );
}

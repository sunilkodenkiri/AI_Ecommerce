"use client";
import BuyerPanel from "./BuyerPanel";
import AIPanel from "./AIPanel";
import RightPanel from "./RightPanel";
export default function Page() {
  return <div className="grid md:grid-cols-3 gap-4"><BuyerPanel/><AIPanel/><RightPanel/></div>;
}

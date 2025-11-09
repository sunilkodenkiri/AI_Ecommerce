"use client";
import { useEffect } from "react";

export default function Modal(props: { open: boolean; onClose: ()=>void; title?: string; children?: React.ReactNode }) {
  useEffect(() => {
    function onEsc(e: KeyboardEvent){ if (e.key==="Escape") props.onClose(); }
    if (props.open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [props.open]);

  if (!props.open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 grid place-items-center z-50" onClick={props.onClose}>
      <div className="bg-white text-black rounded-xl p-4 w-[min(520px,92vw)] shadow-xl" onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{props.title || "Modal"}</h3>
          <button onClick={props.onClose} aria-label="Close" className="px-2 py-1 rounded bg-slate-200">✕</button>
        </div>
        <div>{props.children}</div>
      </div>
    </div>
  );
}

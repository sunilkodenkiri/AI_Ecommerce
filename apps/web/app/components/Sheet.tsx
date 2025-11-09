"use client";
import { useEffect, useRef } from "react";

export default function Sheet({
  open,
  onClose,
  side = "right",
  children,
  title
}: {
  open: boolean;
  onClose: () => void;
  side?: "right" | "left";
  children: React.ReactNode;
  title?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        className={[
          "absolute top-0 h-full w-full sm:w-[480px] bg-slate-900 border border-white/10 shadow-xl",
          "transition-transform duration-300 ease-out will-change-transform",
          side === "right" ? "right-0 translate-x-0" : "left-0 translate-x-0"
        ].join(" ")}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-semibold truncate">{title}</h3>
          <button
            onClick={onClose}
            className="px-2 py-1 text-sm rounded bg-white/10 hover:bg-white/20"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-4 overflow-auto h-[calc(100%-56px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

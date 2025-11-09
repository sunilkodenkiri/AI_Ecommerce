// apps/web/app/components/DemoToolbar.tsx
"use client";
import { useEffect, useState } from "react";
import { sim, recorder } from "@ac/core";

export default function DemoToolbar() {
  const [speed, setSpeed] = useState(sim.settings.speed);
  const [seed, setSeed] = useState(String(sim.settings.seed));
  const [defect, setDefect] = useState(sim.settings.chaos.vendorDefault);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    sim.setSettings({ speed, chaos: { vendorDefault: defect } });
  }, [speed, defect]);

  function onReset() {
    sim.reset(parseInt(seed || "42", 10));
  }
  function onDownload() {
    const data = recorder.dump();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "session-transcript.json"; a.click();
    URL.revokeObjectURL(url);
  }
  function toggleRecord() {
    if (!recording) recorder.start(); else recorder.stop();
    setRecording(!recording);
  }

  return (
    <div className="sticky top-0 z-50 mb-4 p-3 rounded-xl border bg-white/10 backdrop-blur">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="font-semibold">Demo Controls</div>
        <div className="flex items-center gap-2">
          <span>Speed</span>
          <select value={speed} onChange={e=>setSpeed(e.target.value as any)} className="bg-black/30 border rounded px-2 py-1">
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span>Seed</span>
          <input value={seed} onChange={e=>setSeed(e.target.value)} className="w-24 bg-black/30 border rounded px-2 py-1"/>
          <button onClick={onReset} className="px-2 py-1 rounded bg-slate-700 text-white">Reset</button>
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={defect} onChange={e=>setDefect(e.target.checked)}/>
          Vendor Default (chaos)
        </label>
        <button onClick={toggleRecord} className={`px-2 py-1 rounded ${recording ? "bg-emerald-600 text-white" : "bg-slate-700 text-white"}`}>
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
        <button onClick={onDownload} className="px-2 py-1 rounded bg-slate-700 text-white">Download Transcript</button>
      </div>
    </div>
  );
}

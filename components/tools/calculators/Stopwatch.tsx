"use client";

import { useEffect, useState } from "react";

export function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setElapsed((value) => value + 10), 10);
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 text-center shadow-sm">
      <p className="text-5xl font-black text-slate-950">{formatElapsed(elapsed)}</p>
      <div className="mt-5 flex justify-center gap-2">
        <button className="focus-ring rounded-md bg-teal-700 px-5 py-3 text-sm font-bold text-white" onClick={() => setRunning(true)} type="button">Iniciar</button>
        <button className="focus-ring rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700" onClick={() => setRunning(false)} type="button">Pausar</button>
        <button className="focus-ring rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700" onClick={() => { setRunning(false); setElapsed(0); }} type="button">Reiniciar</button>
      </div>
    </div>
  );
}

function formatElapsed(ms: number) {
  const minutes = Math.floor(ms / 60000).toString().padStart(2, "0");
  const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
  const centiseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, "0");
  return `${minutes}:${seconds}.${centiseconds}`;
}

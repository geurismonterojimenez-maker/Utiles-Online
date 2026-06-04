"use client";

import { useEffect, useState } from "react";

export function Timer() {
  const [minutes, setMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          setRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const reset = () => {
    setRunning(false);
    setSecondsLeft(minutes * 60);
  };

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 text-center shadow-sm">
      <label className="mx-auto block max-w-xs text-sm font-bold text-slate-700">
        Minutos
        <input className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-4 py-3 text-center" min="1" onChange={(event) => setMinutes(Number(event.target.value) || 1)} type="number" value={minutes} />
      </label>
      <p className="mt-6 text-5xl font-black text-slate-950">{formatTime(secondsLeft)}</p>
      <div className="mt-5 flex justify-center gap-2">
        <button className="focus-ring rounded-md bg-teal-700 px-5 py-3 text-sm font-bold text-white" onClick={() => setRunning(true)} type="button">Iniciar</button>
        <button className="focus-ring rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700" onClick={() => setRunning(false)} type="button">Pausar</button>
        <button className="focus-ring rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700" onClick={reset} type="button">Reiniciar</button>
      </div>
    </div>
  );
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

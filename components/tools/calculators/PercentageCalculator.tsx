"use client";

import { useMemo, useState } from "react";

export function PercentageCalculator() {
  const [percentage, setPercentage] = useState("10");
  const [number, setNumber] = useState("100");
  const [base, setBase] = useState("100");
  const [part, setPart] = useState("25");

  const result = useMemo(() => {
    const p = Number(percentage);
    const n = Number(number);
    const b = Number(base);
    const x = Number(part);
    return {
      percentOf: Number.isFinite(p * n) ? (p / 100) * n : 0,
      whatPercent: b ? (x / b) * 100 : 0,
      increase: Number.isFinite(p * n) ? n + (p / 100) * n : 0,
      decrease: Number.isFinite(p * n) ? n - (p / 100) * n : 0
    };
  }, [percentage, number, base, part]);

  return (
    <div className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-2">
      <div className="space-y-3">
        <label className="block text-sm font-bold text-slate-700">
          Porcentaje
          <input className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-4 py-3" onChange={(event) => setPercentage(event.target.value)} type="number" value={percentage} />
        </label>
        <label className="block text-sm font-bold text-slate-700">
          Número
          <input className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-4 py-3" onChange={(event) => setNumber(event.target.value)} type="number" value={number} />
        </label>
        <label className="block text-sm font-bold text-slate-700">
          Parte
          <input className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-4 py-3" onChange={(event) => setPart(event.target.value)} type="number" value={part} />
        </label>
        <label className="block text-sm font-bold text-slate-700">
          Total
          <input className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-4 py-3" onChange={(event) => setBase(event.target.value)} type="number" value={base} />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Result label={`${percentage}% de ${number}`} value={result.percentOf} />
        <Result label={`${part} es qué % de ${base}`} value={`${result.whatPercent.toFixed(2)}%`} />
        <Result label={`Aumento de ${percentage}%`} value={result.increase} />
        <Result label={`Descuento de ${percentage}%`} value={result.decrease} />
      </div>
    </div>
  );
}

function Result({ label, value }: { label: string; value: number | string }) {
  const formatted = typeof value === "number" ? value.toLocaleString("es", { maximumFractionDigits: 2 }) : value;
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-900">{formatted}</p>
    </div>
  );
}

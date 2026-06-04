"use client";

import { useMemo, useState } from "react";

export function VatCalculator() {
  const [amount, setAmount] = useState("100");
  const [rate, setRate] = useState("18");

  const result = useMemo(() => {
    const base = Number(amount) || 0;
    const vatRate = (Number(rate) || 0) / 100;
    const tax = base * vatRate;
    const total = base + tax;
    const includedBase = vatRate ? base / (1 + vatRate) : base;
    return { tax, total, includedTax: base - includedBase, includedBase };
  }, [amount, rate]);

  return (
    <div className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-3">
        <label className="block text-sm font-bold text-slate-700">
          Importe
          <input className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-4 py-3" onChange={(event) => setAmount(event.target.value)} type="number" value={amount} />
        </label>
        <label className="block text-sm font-bold text-slate-700">
          IVA %
          <input className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-4 py-3" onChange={(event) => setRate(event.target.value)} type="number" value={rate} />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Result label="IVA a agregar" value={result.tax} />
        <Result label="Total con IVA" value={result.total} />
        <Result label="Base si ya incluye IVA" value={result.includedBase} />
        <Result label="IVA incluido" value={result.includedTax} />
      </div>
    </div>
  );
}

function Result({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-900">
        {value.toLocaleString("es", { maximumFractionDigits: 2 })}
      </p>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

const converters = {
  "m-km": { label: "Metros a kilómetros", convert: (value: number) => value / 1000, unit: "km" },
  "km-m": { label: "Kilómetros a metros", convert: (value: number) => value * 1000, unit: "m" },
  "kg-lb": { label: "Kilogramos a libras", convert: (value: number) => value * 2.20462, unit: "lb" },
  "lb-kg": { label: "Libras a kilogramos", convert: (value: number) => value / 2.20462, unit: "kg" },
  "c-f": { label: "Celsius a Fahrenheit", convert: (value: number) => value * 1.8 + 32, unit: "°F" },
  "f-c": { label: "Fahrenheit a Celsius", convert: (value: number) => (value - 32) / 1.8, unit: "°C" }
};

type ConverterKey = keyof typeof converters;

export function UnitConverter() {
  const [value, setValue] = useState("100");
  const [mode, setMode] = useState<ConverterKey>("m-km");
  const result = useMemo(() => converters[mode].convert(Number(value) || 0), [mode, value]);

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[1fr_260px]">
        <label className="block text-sm font-bold text-slate-700">
          Valor
          <input className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-4 py-3" onChange={(event) => setValue(event.target.value)} type="number" value={value} />
        </label>
        <label className="block text-sm font-bold text-slate-700">
          Conversión
          <select className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-4 py-3" onChange={(event) => setMode(event.target.value as ConverterKey)} value={mode}>
            {Object.entries(converters).map(([key, converter]) => (
              <option key={key} value={key}>{converter.label}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-5 rounded-md bg-slate-50 p-5">
        <p className="text-sm font-bold text-slate-600">Resultado</p>
        <p className="mt-2 text-3xl font-black text-slate-900">
          {result.toLocaleString("es", { maximumFractionDigits: 4 })} {converters[mode].unit}
        </p>
      </div>
    </div>
  );
}

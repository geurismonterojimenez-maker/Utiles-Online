"use client";

import { useEffect, useState } from "react";

const sets = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%&*_-+=?"
};

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generate = () => {
    const alphabet = sets.lower + sets.upper + sets.numbers + (includeSymbols ? sets.symbols : "");
    const random = new Uint32Array(length);
    crypto.getRandomValues(random);
    setPassword(Array.from(random, (value) => alphabet[value % alphabet.length]).join(""));
  };

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeSymbols, length]);

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <label className="block text-sm font-bold text-slate-700">
          Longitud: {length}
          <input className="mt-3 w-full accent-teal-700" max="40" min="8" onChange={(event) => setLength(Number(event.target.value))} type="range" value={length} />
        </label>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <input checked={includeSymbols} className="accent-teal-700" onChange={(event) => setIncludeSymbols(event.target.checked)} type="checkbox" />
          Incluir símbolos
        </label>
      </div>
      <div className="mt-5 rounded-md bg-slate-50 p-4">
        <p className="break-all text-xl font-black text-slate-900">{password || "Generando..."}</p>
      </div>
      <button className="focus-ring mt-4 rounded-md bg-teal-700 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800" onClick={generate} type="button">
        Generar otra
      </button>
    </div>
  );
}

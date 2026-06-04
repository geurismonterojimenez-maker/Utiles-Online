"use client";

import { useMemo, useState } from "react";

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");

  const age = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(`${birthDate}T00:00:00`);
    const today = new Date();
    if (Number.isNaN(birth.getTime()) || birth > today) return null;

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += previousMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return { years, months, days };
  }, [birthDate]);

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <label className="block max-w-md text-sm font-bold text-slate-700">
        Fecha de nacimiento
        <input
          className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-4 py-3"
          max={new Date().toISOString().slice(0, 10)}
          onChange={(event) => setBirthDate(event.target.value)}
          type="date"
          value={birthDate}
        />
      </label>
      <div className="mt-5 rounded-md bg-slate-50 p-5">
        <p className="text-sm font-bold text-slate-600">Edad exacta</p>
        <p className="mt-2 text-2xl font-black text-slate-900">
          {age ? `${age.years} años, ${age.months} meses y ${age.days} días` : "Selecciona una fecha válida"}
        </p>
      </div>
    </div>
  );
}

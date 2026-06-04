"use client";

import { useEffect, useState } from "react";

const storageKey = "utilesonline-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(!window.localStorage.getItem(storageKey));
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(storageKey, "accepted");
    } catch {
      // Consent still closes the banner when storage is unavailable.
    }
    setVisible(false);
  };

  const reject = () => {
    try {
      window.localStorage.setItem(storageKey, "essential");
    } catch {
      // Consent still closes the banner when storage is unavailable.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section
      aria-label="Aviso de cookies"
      className="fixed bottom-4 left-1/2 z-50 w-[min(720px,calc(100%-32px))] -translate-x-1/2 rounded-md border border-slate-200 bg-white p-4 shadow-xl"
    >
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-black text-slate-900">Privacidad y cookies</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Usamos cookies esenciales y, si aceptas, medición y publicidad para mejorar el sitio y monetizar sin afectar la navegación.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="focus-ring rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700"
            onClick={reject}
            type="button"
          >
            Solo esenciales
          </button>
          <button
            className="focus-ring rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800"
            onClick={accept}
            type="button"
          >
            Aceptar
          </button>
        </div>
      </div>
    </section>
  );
}

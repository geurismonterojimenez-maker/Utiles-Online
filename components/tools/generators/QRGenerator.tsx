"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

export function QRGenerator() {
  const [value, setValue] = useState("https://utilesonline.com");
  const [qr, setQr] = useState("");

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value || " ", { margin: 2, width: 240 })
      .then((url) => {
        if (active) setQr(url);
      })
      .catch(() => {
        if (active) setQr("");
      });
    return () => {
      active = false;
    };
  }, [value]);

  return (
    <div className="grid gap-5 rounded-md border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_280px]">
      <label className="block text-sm font-bold text-slate-700">
        Texto o URL
        <textarea
          className="focus-ring mt-2 min-h-40 w-full resize-y rounded-md border border-slate-300 px-4 py-3"
          onChange={(event) => setValue(event.target.value)}
          placeholder="https://..."
          value={value}
        />
      </label>
      <div className="flex flex-col items-center justify-center rounded-md bg-slate-50 p-5">
        {qr ? <img alt="Código QR generado" height="240" loading="lazy" src={qr} width="240" /> : null}
        {qr ? (
          <a className="mt-4 rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white" download="codigo-qr.png" href={qr}>
            Descargar PNG
          </a>
        ) : null}
      </div>
    </div>
  );
}

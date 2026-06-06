import React, { useEffect, useState } from 'react';

interface AdSenseBannerProps {
  slot: string; // AdSense slot ID
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: 'true' | 'false';
  style?: React.CSSProperties;
  className?: string;
  label?: string; // e.g. "Banner Superior", "Lateral Informativo"
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slot,
  format = 'auto',
  responsive = 'true',
  style,
  className = '',
  label = 'Banner de Google AdSense'
}) => {
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    // Attempt to request AdSense load
    try {
      const windowWithAds = window as any;
      if (windowWithAds.adsbygoogle) {
        (windowWithAds.adsbygoogle = windowWithAds.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.warn('AdSense integration alert: AdSense script might be blocked or not fully loaded yet.', err);
      setAdError(true);
    }
  }, [slot]);

  return (
    <div className={`w-full my-4 mx-auto overflow-hidden transition-all duration-350 ${className}`}>
      {/* Visual Header for the Espacio Publicitario */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-100 rounded-t-lg border-t border-x border-slate-200 text-[9px] font-bold text-slate-400 uppercase tracking-widest select-none">
        <span>📢 {label}</span>
        <span className="text-blue-500 font-sans hover:underline cursor-help" title="Este espacio está reservado para generar ingresos con Google AdSense. Una vez que tu cuenta sea aprobada por Google, los anuncios aparecerán automáticamente aquí.">
          info monetización
        </span>
      </div>

      {/* Actual Google AdSense element */}
      <div className={`relative bg-slate-900 rounded-b-lg border border-slate-200 flex flex-col items-center justify-center p-0 leading-none overflow-hidden text-center transition-all ${format === 'rectangle' ? 'min-h-[190px]' : 'min-h-[100px]'}`}>
        <ins
          className="adsbygoogle"
          style={style || { display: 'block', minWidth: '250px', width: '100%', minHeight: format === 'rectangle' ? '190px' : '90px' }}
          data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID || "ca-pub-9482819857182281"}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />

        {/* High-Fidelity Simulator Placeholder when offline/not fully verified yet */}
        <div className="absolute inset-0 bg-slate-950 pointer-events-none overflow-hidden flex rounded-b-lg">
          {format === 'horizontal' ? (
            <div className="relative w-full h-full flex items-center justify-between px-6 py-3 overflow-hidden select-none">
              <img 
                src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=1200&auto=format&fit=crop" 
                alt="Feria Escolar RD" 
                className="absolute inset-0 w-full h-full object-cover opacity-20 filter saturate-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent"></div>
              <div className="relative z-10 text-left max-w-xl flex flex-col justify-center">
                <span className="text-[8px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-sm uppercase tracking-wider w-max mb-1.5 shadow-sm">
                  OFERTA PATROCINADA • RD
                </span>
                <h4 className="text-white text-xs sm:text-[14px] font-black tracking-tight leading-none uppercase">
                  🎒 Feria Escolar 2026: ¡Ahorra hasta RD$3,500 en Útiles!
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-300 font-medium mt-1 line-clamp-1">
                  Compara los precios en vivo de Sirena, Jumbo y Nacional. Los mejores cuadernos y mochilas.
                </p>
              </div>
              <div className="relative z-10 hidden md:flex flex-col items-end gap-1 shrink-0 ml-4">
                <span className="bg-emerald-500 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse shadow-sm">
                  Envío Gratis RD
                </span>
                <span className="text-[8px] text-slate-400 font-mono">Anuncio: slot-{slot}</span>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex flex-col justify-end p-4 text-left select-none">
              <img 
                src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600&auto=format&fit=crop" 
                alt="Material Escolar" 
                className="absolute inset-0 w-full h-full object-cover opacity-25 filter brightness-90 saturate-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent"></div>
              <div className="relative z-10 flex flex-col gap-1.5 mt-auto">
                <span className="text-[8px] bg-orange-500 text-white font-black px-2 py-0.5 rounded-sm uppercase tracking-wider w-max shadow-sm">
                  CALIDAD PREMIUM
                </span>
                <h4 className="text-white text-xs sm:text-[13px] font-black tracking-tight leading-snug uppercase">
                  ✏️ Cuadernos Mascot RD • Con Hojas Satinadas
                </h4>
                <p className="text-[10px] text-slate-300 leading-normal line-clamp-2">
                  La marca favorita elegida por los colegios dominicanos. Costura reforzada que previene el deshoje.
                </p>
                <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-1">
                  <span className="text-[8px] text-amber-300 font-black uppercase tracking-wider">★ Recomendado Oficial</span>
                  <span className="text-[8px] text-slate-500 font-mono">slot-{slot}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

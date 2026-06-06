import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function FaqsView() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          ¿Cómo funciona útiles.online República Dominicana?
        </h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Para facilitar el regreso a clases de tus hijos en R.D. hemos digitalizado el proceso para ahorrarte filas, horas de tráfico y sobrecostos en material de papelería escolar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3">
            <span className="bg-blue-100 text-blue-700 font-extrabold w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-sans">1</span>
            <div>
              <h5 className="font-extrabold text-slate-800 text-xs">Busca por Colegio</h5>
              <p className="text-xs text-slate-500 mt-1">
                Elige tu colegio autorizado (La Salle, Loyola, Babeque, Saint George, etc.) y carga la lista oficial de útiles recomendada por los profesores de inmediato.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3">
            <span className="bg-blue-100 text-blue-700 font-extrabold w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-sans">2</span>
            <div>
              <h5 className="font-extrabold text-slate-800 text-xs">Personaliza tu Pack</h5>
              <p className="text-xs text-slate-500 mt-1">
                ¿Ya tienes sacapuntas, colores del año anterior o mochilas escolares? Desmárcalos de la lista interactiva para que no se sumen a tu cuenta. ¡Compra solo lo que te falta!
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3">
            <span className="bg-blue-100 text-blue-700 font-extrabold w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-sans">3</span>
            <div>
              <h5 className="font-extrabold text-slate-800 text-xs">Escanea con IA</h5>
              <p className="text-xs text-slate-500 mt-1">
                Si tu escuela no figura o tienes un borrador de útiles, cópialo en nuestro Escáner Inteligente con Gemini AI. Reconocerá y elegirá los artículos a la perfección.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3">
            <span className="bg-blue-100 text-blue-700 font-extrabold w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-sans">4</span>
            <div>
              <h5 className="font-extrabold text-slate-800 text-xs">Recibe a Domicilio</h5>
              <p className="text-xs text-slate-500 mt-1">
                Recibe el paquete completo empacado con cuidado a domicilio en Santo Domingo (Norte, Sur, Este, Oeste), Santiago, La Vega, San Cristóbal y demás provincias en 24-48 horas.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ ACCORDION BLOCK */}
        <h4 className="font-extrabold text-slate-900 text-sm uppercase mt-8 border-t border-slate-100 pt-6">Preguntas Frecuentes</h4>
        <div className="flex flex-col gap-3 mt-4 text-xs">
          <div className="bg-slate-50 border p-3.5 rounded-xl border-slate-150">
            <p className="font-bold text-slate-800">¿Cómo pago mi pedido?</p>
            <p className="text-slate-500 mt-1 leading-relaxed">Simulamos las órdenes localmente. Te generaremos una orden oficial de reservación escolar en dop, la cual podrás imprimir. El pago y despacho físico es coordinado vía WhatsApp.</p>
          </div>
          <div className="bg-slate-50 border p-3.5 rounded-xl border-slate-150">
            <p className="font-bold text-slate-800">¿Hacer entregas en el interior de República Dominicana?</p>
            <p className="text-slate-500 mt-1 leading-relaxed">Sí. Enviamos a todas las provincias de R.D. mediante Caribe Pack, Metro Pac, o transporte motorizado express certificado en el Gran Santo Domingo.</p>
          </div>
          <div className="bg-slate-50 border p-3.5 rounded-xl border-slate-150">
            <p className="font-bold text-slate-800">¿Qué pasa si un útil escolar sale defectuoso o no es el requerido?</p>
            <p className="text-slate-500 mt-1 leading-relaxed">Contamos con una política estricta de cambios sin costo adicional durante los primeros 15 días del año escolar.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

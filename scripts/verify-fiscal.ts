import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import { TAX_RATES_REGISTRY } from "../src/config/tax-rates";

dotenv.config();

const TAX_RATES_PATH = path.join(__dirname, "../src/config/tax-rates.ts");

// Helper to clean HTML to just text
async function fetchPageText(url: string): Promise<string> {
  console.log(`[SCRAPER] Fetching URL: ${url}`);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      signal: AbortSignal.timeout(10000) // 10s timeout
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const html = await res.text();
    // Strip scripts, styles, and html tags
    const cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return cleanText.slice(0, 50000); // Limit text length to prevent context explosion
  } catch (error: any) {
    console.warn(`[SCRAPER] Error fetching ${url}: ${error.message}`);
    return "";
  }
}

// Generate the TypeScript file contents
function generateTaxRatesFileContent(registry: any): string {
  // Convert registry to string and substitute null back to Infinity for the last scale
  let registryStr = JSON.stringify(registry, null, 2);
  registryStr = registryStr.replace(/"limiteMaximo":\s*null/g, '"limiteMaximo": Infinity');

  return `/**
 * Tasas de impuestos y deducciones oficiales vigentes en la República Dominicana (2024-2026).
 * Fuente: Dirección General de Impuestos Internos (DGII), Tesorería de la Seguridad Social (TSS),
 * Ministerio de Trabajo y Consejo Nacional de la Seguridad Social (CNSS).
 * 
 * GENERADO AUTOMÁTICAMENTE POR EL CAMPAÑA DE VERIFICACIÓN FISCAL.
 */

export interface TaxRateDetail {
  value: number;
  label: string;
  sourceName: string;
  sourceUrl: string;
  effectiveDate: string;
  lastChecked: string;
  status: "current" | "needs_review" | "source_unavailable";
  notes: string;
}

export type TaxRegistry = {
  itbis: {
    general: TaxRateDetail;
    reducida: TaxRateDetail;
    exento: TaxRateDetail;
  };
  tssEmpleado: {
    afp: TaxRateDetail;
    sfs: TaxRateDetail;
  };
  tssEmpleador: {
    afp: TaxRateDetail;
    sfs: TaxRateDetail;
    srlBase: TaxRateDetail;
    infotep: TaxRateDetail;
  };
  topesCotizables: {
    salarioMinimoTSS: TaxRateDetail;
    afpMultiplicador: TaxRateDetail;
    sfsMultiplicador: TaxRateDetail;
    srlMultiplicador: TaxRateDetail;
  };
  isrEscalasAnuales: {
    escalas: {
      limiteMinimo: number;
      limiteMaximo: number;
      tasa: number;
      excedenteRestar: number;
      tasaFijaAdicional: number;
    }[];
    metadata: TaxRateDetail;
  };
  recargosDGII: {
    primerMes: TaxRateDetail;
    mesesSiguientes: TaxRateDetail;
    interesIndemnizatorio: TaxRateDetail;
  };
  laboralFactoresDivision: {
    mensual: TaxRateDetail;
    quincenal: TaxRateDetail;
    semanal: TaxRateDetail;
    diario: TaxRateDetail;
  };
};

export const TAX_RATES_REGISTRY: TaxRegistry = ${registryStr};

// COMPATIBILITY INTERFACE (DIRECT DOUBLE): Matches exactly the numeric structure of original TAX_RATES so other calculations are completely unaffected!
export const TAX_RATES = {
  itbis: {
    general: TAX_RATES_REGISTRY.itbis.general.value,
    reducida: TAX_RATES_REGISTRY.itbis.reducida.value,
    exento: TAX_RATES_REGISTRY.itbis.exento.value,
  },
  tssEmpleado: {
    afp: TAX_RATES_REGISTRY.tssEmpleado.afp.value,
    sfs: TAX_RATES_REGISTRY.tssEmpleado.sfs.value,
  },
  tssEmpleador: {
    afp: TAX_RATES_REGISTRY.tssEmpleador.afp.value,
    sfs: TAX_RATES_REGISTRY.tssEmpleador.sfs.value,
    srlBase: TAX_RATES_REGISTRY.tssEmpleador.srlBase.value,
    infotep: TAX_RATES_REGISTRY.tssEmpleador.infotep.value,
  },
  topesCotizables: {
    salarioMinimoTSS: TAX_RATES_REGISTRY.topesCotizables.salarioMinimoTSS.value,
    afpMultiplicador: TAX_RATES_REGISTRY.topesCotizables.afpMultiplicador.value,
    sfsMultiplicador: TAX_RATES_REGISTRY.topesCotizables.sfsMultiplicador.value,
    srlMultiplicador: TAX_RATES_REGISTRY.topesCotizables.srlMultiplicador.value,
  },
  isrEscalasAnuales: TAX_RATES_REGISTRY.isrEscalasAnuales.escalas,
  recargosDGII: {
    primerMes: TAX_RATES_REGISTRY.recargosDGII.primerMes.value,
    mesesSiguientes: TAX_RATES_REGISTRY.recargosDGII.mesesSiguientes.value,
    interesIndemnizatorio: TAX_RATES_REGISTRY.recargosDGII.interesIndemnizatorio.value,
  },
  laboralFactoresDivision: {
    mensual: TAX_RATES_REGISTRY.laboralFactoresDivision.mensual.value,
    quincenal: TAX_RATES_REGISTRY.laboralFactoresDivision.quincenal.value,
    semanal: TAX_RATES_REGISTRY.laboralFactoresDivision.semanal.value,
    diario: TAX_RATES_REGISTRY.laboralFactoresDivision.diario.value,
  }
};
`;
}

async function verifyFiscalRates() {
  console.log("[SISTEMA] Iniciando revisión fiscal automatizada...");
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[ERROR] GEMINI_API_KEY no configurada. Abortando revisión fiscal automatizada.");
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  // URLs oficiales de consulta
  const urls = {
    dgii: "https://dgii.gov.do/sujetosPasivos/personasFisicas/paginas/impuestoRenta.aspx",
    tss: "https://tss.gob.do",
    cnss: "https://www.cnss.gob.do"
  };

  const dgiiText = await fetchPageText(urls.dgii);
  const tssText = await fetchPageText(urls.tss);
  const cnssText = await fetchPageText(urls.cnss);

  if (!dgiiText && !tssText && !cnssText) {
    console.warn("[ADVERTENCIA] No se pudo obtener información de ninguna de las fuentes gubernamentales. Marcaremos estado como source_unavailable.");
    
    let modified = false;
    const registry = { ...TAX_RATES_REGISTRY };
    
    // Mark status accordingly if previous status was not already unavailable
    const categories = [
      registry.itbis.general, registry.tssEmpleado.afp, registry.tssEmpleado.sfs,
      registry.tssEmpleador.afp, registry.tssEmpleador.sfs, registry.tssEmpleador.srlBase,
      registry.topesCotizables.salarioMinimoTSS, registry.isrEscalasAnuales.metadata
    ];
    
    for (const item of categories) {
      if (item.status !== "source_unavailable") {
        item.status = "source_unavailable";
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(TAX_RATES_PATH, generateTaxRatesFileContent(registry), "utf8");
      console.log("[SISTEMA] Archivo tax-rates.ts actualizado con estado 'source_unavailable'.");
    }
    return;
  }

  const prompt = `Analiza los siguientes textos limpios extraídos de portales oficiales gubernamentales de la República Dominicana (DGII, TSS y CNSS) e identifica los valores vigentes de impuestos, aportes y topes de seguridad social.

Texto DGII (Escalas de Impuesto Sobre la Renta - ISR):
\"\"\"
${dgiiText || "No disponible"}
\"\"\"

Texto TSS (Tasas de AFP/SFS y salarios mínimos base):
\"\"\"
${tssText || "No disponible"}
\"\"\"

Texto CNSS (Resoluciones y topes de salario cotizable):
\"\"\"
${cnssText || "No disponible"}
\"\"\"

Extrae la información fiscal estructurándola exactamente en el siguiente JSON:
{
  "afpEmpleado": 0.0287, // Tasa AFP empleado (ej: 2.87% -> 0.0287, o null si no se encuentra)
  "sfsEmpleado": 0.0304, // Tasa SFS empleado (ej: 3.04% -> 0.0304)
  "afpEmpleador": 0.0710, // Tasa AFP empleador (7.10% -> 0.0710)
  "sfsEmpleador": 0.0709, // Tasa SFS empleador (7.09% -> 0.0709)
  "srlBase": 0.0120, // Tasa SRL base (1.20% -> 0.012)
  "salarioMinimoTSS": 23223.00, // Salario mínimo nacional de referencia TSS para los topes cotizables (ej: 23223.00)
  "isrEscala1Limit": 416220.00, // Límite máximo exento del primer tramo anual de ISR (ej: 416220.00)
  "isrEscala2Limit": 624329.00, // Límite máximo del segundo tramo anual de ISR
  "isrEscala3Limit": 867123.00  // Límite máximo del tercer tramo anual de ISR (excedente paga 25%)
}

Nota: Si algún dato no se puede encontrar en los textos provistos, devuélvelo como null para ese campo específico. Devuelve únicamente el JSON.`;

  try {
    console.log("[GEMINI] Enviando textos fiscales a la IA para extracción...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Utilizando un modelo rápido y preciso para tareas estructuradas
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            afpEmpleado: { type: Type.NUMBER },
            sfsEmpleado: { type: Type.NUMBER },
            afpEmpleador: { type: Type.NUMBER },
            sfsEmpleador: { type: Type.NUMBER },
            srlBase: { type: Type.NUMBER },
            salarioMinimoTSS: { type: Type.NUMBER },
            isrEscala1Limit: { type: Type.NUMBER },
            isrEscala2Limit: { type: Type.NUMBER },
            isrEscala3Limit: { type: Type.NUMBER }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text.trim());
    console.log("[GEMINI] Tasas extraídas exitosamente:", parsed);

    const registry = JSON.parse(JSON.stringify(TAX_RATES_REGISTRY)); // deep copy
    let hasChanges = false;

    // Helper to check and mark mismatch
    const checkValue = (nodePath: any, newVal: number | null, fieldName: string) => {
      if (newVal !== null && newVal !== undefined && nodePath.value !== newVal) {
        console.log(`[ALERTA] Diferencia detectada en ${fieldName}: Local=${nodePath.value}, Extraído=${newVal}`);
        nodePath.value = newVal;
        nodePath.status = "needs_review";
        nodePath.notes = `${nodePath.notes} (Revisión fiscal automática detectó cambio el ${new Date().toISOString().slice(0,10)} a RD$ ${newVal} / ${newVal*100}%).`;
        hasChanges = true;
      } else if (newVal !== null) {
        nodePath.status = "current"; // Reset to current if it matches and was previously flagged
      }
    };

    // Check TSS employee rates
    checkValue(registry.tssEmpleado.afp, parsed.afpEmpleado, "AFP Empleado");
    checkValue(registry.tssEmpleado.sfs, parsed.sfsEmpleado, "SFS Empleado");

    // Check TSS employer rates
    checkValue(registry.tssEmpleador.afp, parsed.afpEmpleador, "AFP Empleador");
    checkValue(registry.tssEmpleador.sfs, parsed.sfsEmpleador, "SFS Empleador");
    checkValue(registry.tssEmpleador.srlBase, parsed.srlBase, "SRL Empleador Base");

    // Check TSS Salario Base de referencia
    checkValue(registry.topesCotizables.salarioMinimoTSS, parsed.salarioMinimoTSS, "Salario Base TSS");

    // Check ISR Escalas Anuales limits
    checkValue(registry.isrEscalasAnuales.metadata, parsed.isrEscala1Limit, "Tramo Exento Anual de ISR");
    
    if (parsed.isrEscala1Limit !== null && parsed.isrEscala1Limit !== undefined) {
      const e = registry.isrEscalasAnuales.escalas;
      if (e[0].limiteMaximo !== parsed.isrEscala1Limit) {
        e[0].limiteMaximo = parsed.isrEscala1Limit;
        e[1].limiteMinimo = parsed.isrEscala1Limit + 0.01;
        e[1].excedenteRestar = parsed.isrEscala1Limit + 0.01;
        hasChanges = true;
      }
    }
    if (parsed.isrEscala2Limit !== null && parsed.isrEscala2Limit !== undefined) {
      const e = registry.isrEscalasAnuales.escalas;
      if (e[1].limiteMaximo !== parsed.isrEscala2Limit) {
        e[1].limiteMaximo = parsed.isrEscala2Limit;
        e[2].limiteMinimo = parsed.isrEscala2Limit + 0.01;
        e[2].excedenteRestar = parsed.isrEscala2Limit + 0.01;
        
        // Recalculate fixed amount for Tramo 3
        const range2 = e[1].limiteMaximo - (e[1].limiteMinimo - 0.01);
        e[2].tasaFijaAdicional = Math.round(range2 * 0.15);
        hasChanges = true;
      }
    }
    if (parsed.isrEscala3Limit !== null && parsed.isrEscala3Limit !== undefined) {
      const e = registry.isrEscalasAnuales.escalas;
      if (e[2].limiteMaximo !== parsed.isrEscala3Limit) {
        e[2].limiteMaximo = parsed.isrEscala3Limit;
        e[3].limiteMinimo = parsed.isrEscala3Limit + 0.01;
        e[3].excedenteRestar = parsed.isrEscala3Limit + 0.01;

        // Recalculate fixed amount for Tramo 4
        const range2 = e[1].limiteMaximo - (e[1].limiteMinimo - 0.01);
        const range3 = e[2].limiteMaximo - (e[2].limiteMinimo - 0.01);
        e[3].tasaFijaAdicional = Math.round(range2 * 0.15 + range3 * 0.20);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      const newFileContent = generateTaxRatesFileContent(registry);
      fs.writeFileSync(TAX_RATES_PATH, newFileContent, "utf8");
      console.log("[ÉXITO] Archivo tax-rates.ts actualizado con los cambios fiscales pendientes de revisión.");
    } else {
      console.log("[SISTEMA] No se detectaron diferencias con las tasas locales. El archivo se mantiene intacto.");
    }

  } catch (error: any) {
    console.error("[ERROR] Error procesando la respuesta de Gemini:", error.message);
  }
}

verifyFiscalRates();

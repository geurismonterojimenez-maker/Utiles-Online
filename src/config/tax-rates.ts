/**
 * Tasas de impuestos y deducciones oficiales vigentes en la República Dominicana (2024-2026).
 * Fuente: Dirección General de Impuestos Internos (DGII), Tesorería de la Seguridad Social (TSS),
 * Ministerio de Trabajo y Consejo Nacional de la Seguridad Social (CNSS).
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

export const TAX_RATES_REGISTRY: TaxRegistry = {
  // ITBIS (Impuesto sobre Transferencias de Bienes Industrializados y Servicios)
  itbis: {
    general: {
      value: 0.18,
      label: "ITBIS Tasa General (18%)",
      sourceName: "Dirección General de Impuestos Internos (DGII)",
      sourceUrl: "https://dgii.gov.do",
      effectiveDate: "2013-01-01",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Establecido por la Ley 253-12 sobre Reforma Tributaria Dominicana."
    },
    reducida: {
      value: 0.16,
      label: "ITBIS Tasa Reducida (16%)",
      sourceName: "Dirección General de Impuestos Internos (DGII)",
      sourceUrl: "https://dgii.gov.do",
      effectiveDate: "2016-01-01",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Aplica a productos alimenticios específicos procesados como derivados del lácteo o cacao."
    },
    exento: {
      value: 0.00,
      label: "ITBIS Exento (0%)",
      sourceName: "Dirección General de Impuestos Internos (DGII)",
      sourceUrl: "https://dgii.gov.do",
      effectiveDate: "2013-01-01",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Bienes primarios, productos agropecuarios, educación, agua embotellada y medicamentos de ley."
    }
  },

  // TSS - Aportes del Trabajador (Empleado)
  tssEmpleado: {
    afp: {
      value: 0.0287,
      label: "AFP - Seguro de Vejez, Discapacidad y Sobrevivencia (Pensiones) - Empleado",
      sourceName: "Tesorería de la Seguridad Social (TSS)",
      sourceUrl: "https://tss.gob.do",
      effectiveDate: "2003-06-01",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Resolución oficial de la TSS. Ley No. 87-01 sobre el Sistema Dominicano de Seguridad Social."
    },
    sfs: {
      value: 0.0304,
      label: "SFS - Seguro Familiar de Salud - Empleado",
      sourceName: "Tesorería de la Seguridad Social (TSS)",
      sourceUrl: "https://tss.gob.do",
      effectiveDate: "2007-09-01",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Soporte legal Ley No. 87-01. Aporte retenido directo del empleando de su sueldo bruto ordinario."
    }
  },

  // TSS - Aportes del Empleador (Patronal)
  tssEmpleador: {
    afp: {
      value: 0.0710,
      label: "AFP - Seguro de Vejez, Discapacidad y Sobrevivencia (Pensiones) - Empleador",
      sourceName: "Tesorería de la Seguridad Social (TSS)",
      sourceUrl: "https://tss.gob.do",
      effectiveDate: "2003-06-01",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Aporte patronal de jubilaciones fijado en 7.10%."
    },
    sfs: {
      value: 0.0709,
      label: "SFS - Seguro Familiar de Salud - Empleador",
      sourceName: "Tesorería de la Seguridad Social (TSS)",
      sourceUrl: "https://tss.gob.do",
      effectiveDate: "2007-09-01",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Aporte patronal de salud fijado en 7.09%."
    },
    srlBase: {
      value: 0.0120,
      label: "SRL - Seguro de Riesgos Laborales Base (1.20%)",
      sourceName: "Tesorería de la Seguridad Social (TSS) / IDOPPRIL",
      sourceUrl: "https://tss.gob.do",
      effectiveDate: "2003-06-01",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Aporte patronal variable según el nivel de peligrosidad del sector comercial (rango 1.0% al 1.4%). Promedio sectorizado de 1.20%."
    },
    infotep: {
      value: 0.0100,
      label: "INFOTEP (Instituto de Formación Técnica) - Empleador",
      sourceName: "Instituto Nacional de Formación Técnico Profesional (INFOTEP)",
      sourceUrl: "https://www.infotep.gob.do",
      effectiveDate: "1980-01-16",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Ley No. 116-80. Corresponde al 1.00% a cargo exclusivo del patrono/empleador."
    }
  },

  // Topes Salariales Cotizables de la TSS vigentes para el año comercial (2025/2026)
  // El salario nacional base promedio para topes de la TSS se ajustó oficialmente a RD$ 23,223.00.
  topesCotizables: {
    salarioMinimoTSS: {
      value: 23223.00,
      label: "Salario Base para Topes Cotizables (RD$ 23,223.00)",
      sourceName: "Consejo Nacional de la Seguridad Social (CNSS) / TSS",
      sourceUrl: "https://www.cnss.gob.do",
      effectiveDate: "2024-02-01",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Resolución del CNSS que instituye el salario de referencia cotizable para el límite superior de los aportes de seguridad social."
    },
    afpMultiplicador: {
      value: 20,
      label: "Multiplicador de Tope para AFP (20 Salarios Mínimos)",
      sourceName: "Tesorería de la Seguridad Social (TSS)",
      sourceUrl: "https://tss.gob.do",
      effectiveDate: "2003-06-01",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Límite superior equivalente a 20 salarios mínimos. Tope máximo cotizable: RD$ 464,460.00."
    },
    sfsMultiplicador: {
      value: 10,
      label: "Multiplicador de Tope para SFS (10 Salarios Mínimos)",
      sourceName: "Tesorería de la Seguridad Social (TSS)",
      sourceUrl: "https://tss.gob.do",
      effectiveDate: "2007-09-01",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Límite superior equivalente a 10 salarios mínimos. Tope máximo cotizable: RD$ 232,230.00."
    },
    srlMultiplicador: {
      value: 4,
      label: "Multiplicador de Tope para SRL (4 Salarios Mínimos)",
      sourceName: "Tesorería de la Seguridad Social (TSS) / IDOPPRIL",
      sourceUrl: "https://tss.gob.do",
      effectiveDate: "2003-06-01",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Límite superior equivalente a 4 salarios mínimos. Tope máximo cotizable: RD$ 92,892.00."
    }
  },

  // Escala Impositiva del Impuesto Sobre la Renta (ISR) para personas físicas / asalariados (Vigente DGII)
  isrEscalasAnuales: {
    escalas: [
      {
        limiteMinimo: 0,
        limiteMaximo: 416220.00,
        tasa: 0.0,
        excedenteRestar: 0,
        tasaFijaAdicional: 0
      },
      {
        limiteMinimo: 416220.01,
        limiteMaximo: 624329.00,
        tasa: 0.15,
        excedenteRestar: 416220.01,
        tasaFijaAdicional: 0
      },
      {
        limiteMinimo: 624329.01,
        limiteMaximo: 867123.00,
        tasa: 0.20,
        excedenteRestar: 624329.01,
        tasaFijaAdicional: 31216.00 // Equivalente al 15% del tramo anterior completo
      },
      {
        limiteMinimo: 867123.01,
        limiteMaximo: Infinity,
        tasa: 0.25,
        excedenteRestar: 867123.01,
        tasaFijaAdicional: 79776.00 // Equivalente a las tasas fijas acumuladas de tramos anteriores
      }
    ],
    metadata: {
      value: 416220.00,
      label: "Escala Impositiva Anual para Retenciones de ISR",
      sourceName: "Dirección General de Impuestos Internos (DGII)",
      sourceUrl: "https://dgii.gov.do",
      effectiveDate: "2017-01-01",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Indexación suspendida. Vigente según Ley General de Presupuesto del Estado sobre escalas de gravamen para trabajadores y profesionales asalariados."
    }
  },

  // Recargos de la DGII por declaración o pago fuera de fecha (Art. 252 Código Tributario)
  recargosDGII: {
    primerMes: {
      value: 0.10,
      label: "Mora Primer Mes o Fracción (10%)",
      sourceName: "Dirección General de Impuestos Internos (DGII)",
      sourceUrl: "https://dgii.gov.do",
      effectiveDate: "1992-05-16",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Sanción reglamentaria directa fijada en el Art. 252 literal a) del Código Tributario Dominicano."
    },
    mesesSiguientes: {
      value: 0.04,
      label: "Mora Meses Subsiguientes o Fracción (4%)",
      sourceName: "Dirección General de Impuestos Internos (DGII)",
      sourceUrl: "https://dgii.gov.do",
      effectiveDate: "1992-05-16",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Recargo moratorio progresivo por cada mes de retraso continuo en el ITBIS, IR-17 u otros formularios."
    },
    interesIndemnizatorio: {
      value: 0.011,
      label: "Interés Indemnizatorio Mensual (1.1%)",
      sourceName: "Dirección General de Impuestos Internos (DGII)",
      sourceUrl: "https://dgii.gov.do",
      effectiveDate: "1992-05-16",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Rédito indemnizatorio a favor de la Administración Fiscal Dominicana."
    }
  },

  // Factores Oficiales del Ministerio de Trabajo (Monthly Division Factors)
  laboralFactoresDivision: {
    mensual: {
      value: 23.83,
      label: "Factor Promedio Mensual Laboral (23.83)",
      sourceName: "Ministerio de Trabajo - Código de Trabajo",
      sourceUrl: "https://mt.gob.do",
      effectiveDate: "1992-05-29",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Módulo legal de cálculo de salarios por día ordinario. Fruto de restar los domingos de descanso obligatorio anual."
    },
    quincenal: {
      value: 11.91,
      label: "Factor Promedio Quincenal Laboral (11.91)",
      sourceName: "Ministerio de Trabajo - Código de Trabajo",
      sourceUrl: "https://mt.gob.do",
      effectiveDate: "1992-05-29",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Equivalente al factor mensual dividido entre 2."
    },
    semanal: {
      value: 5.50,
      label: "Factor Promedio Semanal Laboral (5.5)",
      sourceName: "Ministerio de Trabajo - Código de Trabajo",
      sourceUrl: "https://mt.gob.do",
      effectiveDate: "1992-05-29",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Equivalente a los días ordinarios a pagar en nómina semanal de 44 horas."
    },
    diario: {
      value: 1.00,
      label: "Factor Promedio Diario Laboral (1.0)",
      sourceName: "Ministerio de Trabajo",
      sourceUrl: "https://mt.gob.do",
      effectiveDate: "1992-05-29",
      lastChecked: "2026-05-30",
      status: "current",
      notes: "Valor de conversión base."
    }
  }
};

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

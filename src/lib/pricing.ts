export interface PricingInputs {
  leadsMensuales: number;
  gastoAds: number;
  ticketPromedio: number;
}

export interface ServicioPricing {
  nombre: string;
  setup: number;
  mensual: number;
  descripcion: string;
}

export interface PricingResult {
  servicios: ServicioPricing[];
  ingresoEstimadoCliente: number;
  roiEstimado: string;
}

function round50(n: number): number {
  return Math.round(n / 50) * 50;
}

export function calcularPricingPremium(inputs: PricingInputs): PricingResult {
  const { leadsMensuales, gastoAds, ticketPromedio } = inputs;

  // Revenue potential del cliente
  const conversionRate = 0.05; // 5% conversión leads a clientes
  const clientesNuevos = leadsMensuales * conversionRate;
  const ingresoEstimado = clientesNuevos * ticketPromedio;

  // Pricing basado en valor entregado (10-20% del valor generado)
  // gastoAds se incluye en el cálculo de ROI: el cliente ya invierte en ads,
  // nuestro servicio mejora su conversión sobre ese gasto existente
  const valorBase = (ingresoEstimado + gastoAds * 0.1) * 0.15;

  const servicios: ServicioPricing[] = [
    {
      nombre: "Landing Page IA",
      setup: round50(Math.max(497, valorBase * 1.5)),
      mensual: round50(Math.max(97, valorBase * 0.3)),
      descripcion:
        "Web optimizada para conversión + formularios inteligentes + A/B testing IA",
    },
    {
      nombre: "Setter IA (WhatsApp)",
      setup: round50(Math.max(697, valorBase * 2)),
      mensual: round50(Math.max(197, valorBase * 0.5)),
      descripcion:
        "Agente WhatsApp 24/7 + cualificación automática + agenda citas",
    },
    {
      nombre: "Seguimiento Automático",
      setup: round50(Math.max(397, valorBase * 1)),
      mensual: round50(Math.max(147, valorBase * 0.35)),
      descripcion:
        "Secuencias email/SMS + recordatorios + reactivación clientes inactivos",
    },
    {
      nombre: "Pack Completo",
      setup: round50(Math.max(1497, valorBase * 3.5)),
      mensual: round50(Math.max(397, valorBase * 0.9)),
      descripcion:
        "Todo incluido + dashboard métricas + soporte prioritario + consultoría mensual",
    },
  ];

  // ROI incluye gasto en ads como inversión total del cliente
  const inversionTotal = servicios[3].mensual + gastoAds;

  return {
    servicios,
    ingresoEstimadoCliente: Math.round(ingresoEstimado),
    roiEstimado: `${Math.round(ingresoEstimado / (inversionTotal || 1))}x`,
  };
}

export function calcularPricingAgresivo(inputs: PricingInputs): PricingResult {
  const premium = calcularPricingPremium(inputs);

  // Agresivo: 40% menos setup, 30% menos mensual — para entrar rápido
  const servicios: ServicioPricing[] = premium.servicios.map((s) => ({
    ...s,
    setup: round50(s.setup * 0.6),
    mensual: round50(s.mensual * 0.7),
  }));

  return {
    servicios,
    ingresoEstimadoCliente: premium.ingresoEstimadoCliente,
    roiEstimado: `${Math.round(premium.ingresoEstimadoCliente / ((servicios[3].mensual + inputs.gastoAds) || 1))}x`,
  };
}

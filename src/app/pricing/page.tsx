"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Nav from "@/components/Nav";
import PricingSlider from "@/components/PricingSlider";
import PricingTable from "@/components/PricingTable";
import {
  calcularPricingPremium,
  calcularPricingAgresivo,
} from "@/lib/pricing";
import { usePaso } from "@/lib/use-paso";

export default function PricingPage() {
  const [leads, setLeads] = useState(200);
  const [gastoAds, setGastoAds] = useState(500);
  const [ticket, setTicket] = useState(150);
  const [mode, setMode] = useState<"premium" | "agresivo">("premium");
  const { guardar, cargar, tieneProyecto } = usePaso("pricing");

  useEffect(() => {
    cargar().then((d) => {
      if (d?.metadata) {
        const m = d.metadata as Record<string, number | string>;
        if (m.leads) setLeads(m.leads as number);
        if (m.gastoAds) setGastoAds(m.gastoAds as number);
        if (m.ticket) setTicket(m.ticket as number);
        if (m.mode) setMode(m.mode as "premium" | "agresivo");
      }
    });
  }, [cargar]);

  const handleSave = useCallback(() => {
    if (!tieneProyecto) return;
    guardar(
      JSON.stringify({ leads, gastoAds, ticket, mode }),
      { leads, gastoAds, ticket, mode }
    );
  }, [tieneProyecto, guardar, leads, gastoAds, ticket, mode]);

  const inputs = useMemo(
    () => ({ leadsMensuales: leads, gastoAds, ticketPromedio: ticket }),
    [leads, gastoAds, ticket]
  );

  const resultPremium = useMemo(() => calcularPricingPremium(inputs), [inputs]);
  const resultAgresivo = useMemo(
    () => calcularPricingAgresivo(inputs),
    [inputs]
  );

  const activeResult = mode === "premium" ? resultPremium : resultAgresivo;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Nav />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Calculadora de Pricing
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Ajusta los parametros del cliente y obtiene precios sugeridos para
            tus servicios de automatizacion con IA.
          </p>
          <p className="text-xs text-zinc-600 mt-2">
            Precios orientativos basados en modelos de conversion estimados — ajusta segun tu mercado real
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sliders */}
          <div className="lg:col-span-1 space-y-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              Datos del cliente
            </h2>

            <PricingSlider
              label="Leads mensuales"
              value={leads}
              min={10}
              max={2000}
              step={10}
              onChange={setLeads}
            />

            <PricingSlider
              label="Gasto en Ads mensual"
              value={gastoAds}
              min={0}
              max={5000}
              step={50}
              suffix=" EUR"
              onChange={setGastoAds}
            />

            <PricingSlider
              label="Ticket promedio cliente"
              value={ticket}
              min={10}
              max={2000}
              step={10}
              suffix=" EUR"
              onChange={setTicket}
            />

            {/* Mode toggle */}
            <div className="pt-4 border-t border-zinc-700">
              <p className="text-sm text-zinc-400 mb-3">Estrategia de precio</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode("premium")}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                    mode === "premium"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-white"
                  }`}
                >
                  Premium
                </button>
                <button
                  onClick={() => setMode("agresivo")}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                    mode === "agresivo"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-white"
                  }`}
                >
                  Agresivo
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                {mode === "premium"
                  ? "Menos clientes, mayor margen por cliente"
                  : "Precios bajos para captar volumen rápido"}
              </p>
            </div>

            {tieneProyecto && (
              <button
                onClick={handleSave}
                className="w-full mt-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors border border-zinc-700"
              >
                Guardar en proyecto
              </button>
            )}
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <PricingTable result={activeResult} mode={mode} />

            {/* Comparativa rápida */}
            <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-zinc-400 mb-4">
                Comparativa rapida
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-500 mb-2">
                    Si vendes 5 Pack Completo/mes
                  </p>
                  <p className="text-xl font-bold text-white tabular-nums">
                    {(activeResult.servicios[3].setup * 5).toLocaleString(
                      "es-ES"
                    )}{" "}
                    EUR setup
                  </p>
                  <p className="text-lg font-semibold text-blue-400 tabular-nums">
                    +{" "}
                    {(activeResult.servicios[3].mensual * 5).toLocaleString(
                      "es-ES"
                    )}{" "}
                    EUR/mes MRR
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-2">
                    MRR anualizado (5 clientes)
                  </p>
                  <p className="text-xl font-bold text-green-400 tabular-nums">
                    {(
                      activeResult.servicios[3].mensual *
                      5 *
                      12
                    ).toLocaleString("es-ES")}{" "}
                    EUR/ano
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Sin contar setup ni nuevos clientes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

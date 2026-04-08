"use client";

import { PricingResult } from "@/lib/pricing";

interface PricingTableProps {
  result: PricingResult;
  mode: "premium" | "agresivo";
}

export default function PricingTable({ result, mode }: PricingTableProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">
          {mode === "premium" ? "Oferta Premium" : "Oferta Agresiva"}
        </h2>
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            mode === "premium"
              ? "bg-amber-500/20 text-amber-400"
              : "bg-green-500/20 text-green-400"
          }`}
        >
          {mode === "premium" ? "Mayor rentabilidad" : "Entrada rápida"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-400 bg-zinc-800/50 border border-zinc-700">
                Servicio
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-blue-400 bg-zinc-800/50 border border-zinc-700">
                Setup
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-blue-400 bg-zinc-800/50 border border-zinc-700">
                Mensual
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-400 bg-zinc-800/50 border border-zinc-700">
                Incluye
              </th>
            </tr>
          </thead>
          <tbody>
            {result.servicios.map((s, i) => (
              <tr key={i} className="hover:bg-zinc-800/30">
                <td className="px-4 py-3 text-sm font-semibold text-white border border-zinc-700">
                  {s.nombre}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-300 border border-zinc-700 text-right tabular-nums">
                  {s.setup.toLocaleString("es-ES")} EUR
                </td>
                <td className="px-4 py-3 text-sm text-zinc-300 border border-zinc-700 text-right tabular-nums">
                  {s.mensual.toLocaleString("es-ES")} EUR/mes
                </td>
                <td className="px-4 py-3 text-sm text-zinc-400 border border-zinc-700">
                  {s.descripcion}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Métricas */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <p className="text-xs text-zinc-500 mb-1">
            Ingreso estimado del cliente
          </p>
          <p className="text-2xl font-bold text-white tabular-nums">
            {result.ingresoEstimadoCliente.toLocaleString("es-ES")} EUR/mes
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Basado en leads x conversión x ticket
          </p>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <p className="text-xs text-zinc-500 mb-1">ROI para el cliente</p>
          <p className="text-2xl font-bold text-green-400 tabular-nums">
            {result.roiEstimado}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Ingreso generado vs coste pack completo
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import Nav from "@/components/Nav";
import AnalysisResult from "@/components/AnalysisResult";

const PROBLEMAS = [
  { id: "landing", label: "Landing Pages", desc: "Tu web no convierte visitantes en clientes" },
  { id: "captacion", label: "Captación de Leads", desc: "Sin leads no hay ventas, dependes del boca a boca" },
  { id: "atencion", label: "Atención a Leads", desc: "Pierdes leads porque no respondes rápido" },
  { id: "seguimiento", label: "Seguimientos y Recordatorios", desc: "El dinero está en el seguimiento y lo haces manual" },
  { id: "ltv", label: "Lifetime Value (LTV)", desc: "Clientes vienen una vez y no vuelven" },
  { id: "fidelizacion", label: "Fidelización", desc: "No tienes sistema para retener clientes" },
  { id: "comunicacion", label: "Ofertas y Comunicación", desc: "No comunicas promociones de forma efectiva" },
  { id: "upsell", label: "Upsell / Cross-sell", desc: "No aprovechas oportunidades de venta adicional" },
];

export default function DiagnosticoPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [nicho, setNicho] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const toggleProblem = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = useCallback(async () => {
    if (!selected.length) return;
    setIsLoading(true);
    setContent("");
    setStep(2);

    const problemas = selected.map(
      (id) => PROBLEMAS.find((p) => p.id === id)?.label + ": " + PROBLEMAS.find((p) => p.id === id)?.desc
    );

    try {
      const res = await fetch("/api/generar-soluciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemas, nicho: nicho.trim() || "Negocio local" }),
      });

      if (!res.ok) { setContent(`Error: ${res.statusText}`); setIsLoading(false); return; }
      const reader = res.body?.getReader();
      if (!reader) { setContent("Error"); setIsLoading(false); return; }

      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setContent(acc);
      }
    } catch {
      setContent("Error: No se pudo conectar");
    } finally {
      setIsLoading(false);
    }
  }, [selected, nicho]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Diagnostico del Negocio
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Paso 1: Identifica los problemas. Paso 2: Obtiene soluciones IA
            personalizadas.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              step === 1 ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400"
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
            Problemas
          </button>
          <div className="w-8 h-px bg-zinc-700" />
          <button
            onClick={() => content && setStep(2)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              step === 2 ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400"
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
            Soluciones IA
          </button>
        </div>

        {step === 1 && (
          <div className="max-w-3xl mx-auto">
            {/* Nicho input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Nicho del cliente (opcional)
              </label>
              <input
                type="text"
                value={nicho}
                onChange={(e) => setNicho(e.target.value)}
                placeholder="Ej: Restaurante, Clínica dental..."
                className="w-full max-w-sm px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Problems grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {PROBLEMAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggleProblem(p.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    selected.includes(p.id)
                      ? "bg-blue-600/10 border-blue-500 ring-1 ring-blue-500"
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        selected.includes(p.id)
                          ? "bg-blue-600 border-blue-600"
                          : "border-zinc-600"
                      }`}
                    >
                      {selected.includes(p.id) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">{p.label}</p>
                      <p className="text-sm text-zinc-400 mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                {selected.length} problema{selected.length !== 1 ? "s" : ""} seleccionado{selected.length !== 1 ? "s" : ""}
              </p>
              <button
                onClick={handleGenerate}
                disabled={!selected.length || isLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold rounded-lg transition-colors"
              >
                Generar Soluciones IA
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <button
              onClick={() => setStep(1)}
              className="mb-4 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              ← Volver a problemas
            </button>
            <AnalysisResult content={content} isLoading={isLoading} />
          </div>
        )}
      </main>
    </div>
  );
}

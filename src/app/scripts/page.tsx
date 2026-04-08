"use client";

import { useState, useCallback } from "react";
import Nav from "@/components/Nav";
import AnalysisResult from "@/components/AnalysisResult";

const NICHOS = [
  "Restaurante",
  "Clínica dental",
  "Inmobiliaria",
  "Clínica estética",
  "Taller mecánico",
  "Gimnasio",
];

const SERVICIOS = [
  "Agente WhatsApp 24/7",
  "Automatización de reservas",
  "Sistema de captación de leads con IA",
  "Atención al cliente automatizada",
];

export default function ScriptsPage() {
  const [nicho, setNicho] = useState("");
  const [servicio, setServicio] = useState(SERVICIOS[0]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!nicho.trim() || isLoading) return;
    setIsLoading(true);
    setContent("");

    try {
      const res = await fetch("/api/generar-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nicho: nicho.trim(), servicio }),
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
  }, [nicho, servicio, isLoading]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Scripts de Venta
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Genera scripts de llamada, WhatsApp, seguimiento y email
            personalizados para tu nicho.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Nicho
              </label>
              <input
                type="text"
                value={nicho}
                onChange={(e) => setNicho(e.target.value)}
                placeholder="Ej: Restaurante..."
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {NICHOS.map((n) => (
                  <button key={n} onClick={() => setNicho(n)} disabled={isLoading}
                    className="px-2 py-0.5 text-xs bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors disabled:opacity-50">
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Servicio que vendes
              </label>
              <select
                value={servicio}
                onChange={(e) => setServicio(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {SERVICIOS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !nicho.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold rounded-lg transition-colors"
          >
            {isLoading ? "Generando scripts..." : "Generar Scripts"}
          </button>
        </div>

        <AnalysisResult content={content} isLoading={isLoading} />
      </main>
    </div>
  );
}

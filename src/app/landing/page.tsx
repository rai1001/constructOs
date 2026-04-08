"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import LandingPreview from "@/components/LandingPreview";

const NICHOS_RAPIDOS = [
  "Restaurante",
  "Clínica dental",
  "Inmobiliaria",
  "Clínica estética",
  "Taller mecánico",
  "Gimnasio",
];

export default function LandingPage() {
  const [agencia, setAgencia] = useState("");
  const [nicho, setNicho] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [landingData, setLandingData] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!agencia.trim() || !nicho.trim()) return;
    setIsLoading(true);
    setError("");
    setLandingData(null);

    try {
      const res = await fetch("/api/generar-landing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agencia: agencia.trim(), nicho: nicho.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al generar la landing");
      } else {
        setLandingData(data);
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Nav />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Generador de Landing Pages
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Introduce el nombre de tu agencia y el nicho. Claude genera el copy
            completo y lo renderizamos en un template profesional.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Nombre de tu agencia
              </label>
              <input
                type="text"
                value={agencia}
                onChange={(e) => setAgencia(e.target.value)}
                placeholder="Ej: AutomatizaIA, NexoDigital..."
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Nicho del cliente
              </label>
              <input
                type="text"
                value={nicho}
                onChange={(e) => setNicho(e.target.value)}
                placeholder="Ej: Clínica dental, Restaurante..."
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Quick niche pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {NICHOS_RAPIDOS.map((n) => (
              <button
                key={n}
                onClick={() => setNicho(n)}
                disabled={isLoading}
                className="px-3 py-1 text-xs bg-zinc-800 border border-zinc-700 rounded-full text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50"
              >
                {n}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !agencia.trim() || !nicho.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold rounded-lg transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generando landing page...
              </span>
            ) : (
              "Generar Landing Page"
            )}
          </button>

          {error && (
            <p className="mt-3 text-sm text-red-400">Error: {error}</p>
          )}
        </div>

        {/* Preview */}
        {landingData && (
          <div>
            <div className="text-center mb-4">
              <span className="text-sm text-zinc-500">
                Preview para:{" "}
                <span className="text-blue-400 font-medium">{agencia}</span>
                {" — "}
                <span className="text-blue-400 font-medium">{nicho}</span>
              </span>
            </div>
            <LandingPreview data={landingData} agencia={agencia} />
          </div>
        )}
      </main>
    </div>
  );
}

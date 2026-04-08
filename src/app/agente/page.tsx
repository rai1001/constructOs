"use client";

import { useState, useCallback } from "react";
import Nav from "@/components/Nav";

const OBJETIVOS = [
  "Agendar cita / reserva",
  "Cualificar leads y pasar a ventas",
  "Atención al cliente 24/7",
  "Tomar pedidos por WhatsApp",
];

const TONOS = ["Cercano y natural", "Profesional y formal", "Directo y conciso"];
const TRATAMIENTOS = ["Tutear (tú)", "Ustedear (usted)"];

const PRESETS: Record<
  string,
  { servicios: string; horario: string; objetivo: string }
> = {
  Restaurante: {
    servicios: "Reservas, menú del día, eventos privados, pedidos a domicilio",
    horario: "Martes a domingo, 13:00-16:00 y 20:00-23:30",
    objetivo: "Agendar cita / reserva",
  },
  "Clínica dental": {
    servicios:
      "Limpieza dental, ortodoncia, implantes, blanqueamiento, revisiones",
    horario: "Lunes a viernes, 9:00-14:00 y 16:00-20:00",
    objetivo: "Agendar cita / reserva",
  },
  Inmobiliaria: {
    servicios: "Venta de pisos, alquiler, valoraciones gratuitas, gestión",
    horario: "Lunes a viernes, 9:30-14:00 y 16:30-19:30. Sábados 10:00-13:00",
    objetivo: "Cualificar leads y pasar a ventas",
  },
  "Clínica estética": {
    servicios:
      "Botox, ácido hialurónico, depilación láser, tratamientos faciales",
    horario: "Lunes a viernes, 10:00-14:00 y 16:00-20:00",
    objetivo: "Agendar cita / reserva",
  },
};

export default function AgentePage() {
  const [config, setConfig] = useState({
    nombreNegocio: "",
    nicho: "",
    servicios: "",
    horario: "",
    ubicacion: "",
    objetivo: OBJETIVOS[0],
    tono: TONOS[0],
    tratamiento: TRATAMIENTOS[0],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isResearching, setIsResearching] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateField = (field: string, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleResearch = useCallback(async () => {
    if (!searchQuery.trim() || isResearching) return;
    setIsResearching(true);
    try {
      const res = await fetch("/api/investigar-negocio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });
      const data = await res.json();
      if (!res.ok) return;
      setConfig((prev) => ({
        ...prev,
        nombreNegocio: data.nombreNegocio || prev.nombreNegocio,
        nicho: data.nicho || prev.nicho,
        servicios: data.servicios || prev.servicios,
        horario: data.horario || prev.horario,
        ubicacion: data.ubicacion || prev.ubicacion,
      }));
    } catch {
      // silently fail
    } finally {
      setIsResearching(false);
    }
  }, [searchQuery, isResearching]);

  const applyPreset = (nicho: string) => {
    const preset = PRESETS[nicho];
    if (preset) {
      setConfig((prev) => ({
        ...prev,
        nicho,
        servicios: preset.servicios,
        horario: preset.horario,
        objetivo: preset.objetivo,
      }));
    } else {
      updateField("nicho", nicho);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!config.nombreNegocio.trim() || !config.nicho.trim()) return;
    setIsLoading(true);
    setPrompt("");
    setCopied(false);

    try {
      const res = await fetch("/api/generar-agente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        setPrompt(`Error: ${err.error || "Error del servidor"}`);
        setIsLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setPrompt("Error: No se pudo leer la respuesta");
        setIsLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setPrompt(accumulated);
      }
    } catch {
      setPrompt("Error: No se pudo conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canGenerate =
    config.nombreNegocio.trim() && config.nicho.trim() && !isLoading;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Nav />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Generador de Agente WhatsApp
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Configura tu agente IA y genera el prompt listo para Dify. El agente
            atiende leads 24/7, cualifica y agenda citas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Config panel */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
            {/* Auto-research */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
              <label className="block text-sm font-medium text-blue-400 mb-2">
                Investigar negocio automaticamente
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nombre, URL o Google Maps del negocio..."
                  className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={isResearching}
                  onKeyDown={(e) => e.key === "Enter" && handleResearch()}
                />
                <button
                  onClick={handleResearch}
                  disabled={isResearching || !searchQuery.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                >
                  {isResearching ? "Buscando..." : "Investigar"}
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-1.5">
                Rellena los campos automaticamente con datos del negocio
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-px bg-zinc-700" />
              <p className="relative -top-2.5 text-center">
                <span className="bg-zinc-900 px-3 text-xs text-zinc-500">
                  o rellena manualmente
                </span>
              </p>
            </div>

            {/* Nombre negocio */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Nombre del negocio
              </label>
              <input
                type="text"
                value={config.nombreNegocio}
                onChange={(e) => updateField("nombreNegocio", e.target.value)}
                placeholder="Ej: Taberna El Rincón, Clínica Dental Sonríe..."
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Nicho con presets */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Nicho / Sector
              </label>
              <input
                type="text"
                value={config.nicho}
                onChange={(e) => updateField("nicho", e.target.value)}
                placeholder="Ej: Restaurante, Clínica dental..."
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(PRESETS).map((n) => (
                  <button
                    key={n}
                    onClick={() => applyPreset(n)}
                    className="px-2.5 py-1 text-xs bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Servicios */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Servicios principales
              </label>
              <textarea
                value={config.servicios}
                onChange={(e) => updateField("servicios", e.target.value)}
                placeholder="Lista de servicios separados por coma..."
                rows={2}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Horario + Ubicación */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Horario
                </label>
                <input
                  type="text"
                  value={config.horario}
                  onChange={(e) => updateField("horario", e.target.value)}
                  placeholder="L-V 9:00-20:00"
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Ubicacion
                </label>
                <input
                  type="text"
                  value={config.ubicacion}
                  onChange={(e) => updateField("ubicacion", e.target.value)}
                  placeholder="Madrid, Calle..."
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Objetivo */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Objetivo del agente
              </label>
              <select
                value={config.objetivo}
                onChange={(e) => updateField("objetivo", e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {OBJETIVOS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Tono + Tratamiento */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Tono
                </label>
                <select
                  value={config.tono}
                  onChange={(e) => updateField("tono", e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TONOS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Tratamiento
                </label>
                <select
                  value={config.tratamiento}
                  onChange={(e) => updateField("tratamiento", e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TRATAMIENTOS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold rounded-lg transition-colors"
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
                  Generando prompt del agente...
                </span>
              ) : (
                "Generar Prompt del Agente"
              )}
            </button>
          </div>

          {/* Prompt output */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Prompt generado
              </h2>
              {prompt && !isLoading && (
                <button
                  onClick={handleCopy}
                  className="px-4 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  {copied ? "Copiado" : "Copiar prompt"}
                </button>
              )}
            </div>

            {!prompt && !isLoading && (
              <div className="flex items-center justify-center h-64 text-zinc-600 text-sm">
                Configura tu agente y haz clic en &quot;Generar&quot; para ver el
                prompt aqui
              </div>
            )}

            {(prompt || isLoading) && (
              <div className="relative">
                <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-mono leading-relaxed max-h-[600px] overflow-y-auto p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                  {prompt}
                </pre>
                {isLoading && (
                  <div className="flex items-center gap-2 text-zinc-500 text-sm mt-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" />
                    </div>
                    <span>Generando...</span>
                  </div>
                )}
              </div>
            )}

            {prompt && !isLoading && (
              <p className="mt-4 text-xs text-zinc-500">
                Copia este prompt y pegalo en Dify como system prompt de tu
                agente WhatsApp.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

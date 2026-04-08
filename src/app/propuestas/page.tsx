"use client";

import { useState, useCallback } from "react";
import Nav from "@/components/Nav";

const CANALES = [
  "Reunión por Zoom",
  "Reunión presencial",
  "Envío por email",
  "Presentación en evento",
];

export default function PropuestasPage() {
  const [agencia, setAgencia] = useState("");
  const [nicho, setNicho] = useState("");
  const [canal, setCanal] = useState(CANALES[0]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!nicho.trim() || isLoading) return;
    setIsLoading(true);
    setContent("");

    try {
      const res = await fetch("/api/generar-propuesta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agencia: agencia.trim() || "Mi Agencia IA",
          nicho: nicho.trim(),
          canal,
        }),
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
  }, [agencia, nicho, canal, isLoading]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Generador de Propuestas
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Genera un prompt optimizado para Gamma que crea una presentacion
            profesional de 10 slides para cerrar clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Config */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Configuracion</h2>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Nombre de tu agencia
              </label>
              <input
                type="text"
                value={agencia}
                onChange={(e) => setAgencia(e.target.value)}
                placeholder="Ej: AutomatizaIA..."
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Nicho del cliente
              </label>
              <input
                type="text"
                value={nicho}
                onChange={(e) => setNicho(e.target.value)}
                placeholder="Ej: Clínica dental..."
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["Restaurante", "Clínica dental", "Inmobiliaria", "Clínica estética"].map((n) => (
                  <button key={n} onClick={() => setNicho(n)} disabled={isLoading}
                    className="px-2 py-0.5 text-xs bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors disabled:opacity-50">
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Canal de presentacion
              </label>
              <select
                value={canal}
                onChange={(e) => setCanal(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {CANALES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !nicho.trim()}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold rounded-lg transition-colors"
            >
              {isLoading ? "Generando prompt para Gamma..." : "Generar Prompt para Gamma"}
            </button>
          </div>

          {/* Output */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Prompt para Gamma
              </h2>
              {content && !isLoading && (
                <button onClick={handleCopy}
                  className="px-4 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors">
                  {copied ? "Copiado" : "Copiar prompt"}
                </button>
              )}
            </div>

            {!content && !isLoading && (
              <div className="flex items-center justify-center h-64 text-zinc-600 text-sm">
                Configura y genera el prompt para pegarlo en gamma.app
              </div>
            )}

            {(content || isLoading) && (
              <div>
                <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-mono leading-relaxed max-h-[500px] overflow-y-auto p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                  {content}
                </pre>
                {isLoading && (
                  <div className="flex items-center gap-2 text-zinc-500 text-sm mt-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                    </div>
                    <span>Generando...</span>
                  </div>
                )}
                {content && !isLoading && (
                  <p className="mt-4 text-xs text-zinc-500">
                    Copia este prompt y pegalo en gamma.app para generar la
                    presentacion automaticamente.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

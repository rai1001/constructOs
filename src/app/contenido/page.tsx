"use client";

import { useState, useCallback } from "react";
import Nav from "@/components/Nav";
import AnalysisResult from "@/components/AnalysisResult";

const TIPOS = [
  { id: "organico", label: "Contenido Orgánico", desc: "Plan semanal TikTok/Reels/Stories" },
  { id: "flyer", label: "Flyers / Anuncios", desc: "Prompts de imagen + textos publicitarios" },
];

const TONOS = ["Cercano y natural", "Profesional", "Urgente", "Aspiracional"];

export default function ContenidoPage() {
  const [tipo, setTipo] = useState("organico");
  const [nicho, setNicho] = useState("");
  const [tono, setTono] = useState(TONOS[0]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!nicho.trim() || isLoading) return;
    setIsLoading(true);
    setContent("");

    try {
      const res = await fetch("/api/generar-contenido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, nicho: nicho.trim(), tono }),
      });

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
  }, [tipo, nicho, tono, isLoading]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Creador de Contenido
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Genera planes de contenido organico y prompts para flyers
            publicitarios con IA.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          {/* Tipo selector */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {TIPOS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTipo(t.id)}
                className={`text-left p-4 rounded-lg border transition-all ${
                  tipo === t.id
                    ? "bg-blue-600/10 border-blue-500"
                    : "bg-zinc-800 border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <p className="font-medium text-white">{t.label}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Nicho
              </label>
              <input
                type="text"
                value={nicho}
                onChange={(e) => setNicho(e.target.value)}
                placeholder="Ej: Restaurante, Agencia IA..."
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["Agencia de IA", "Restaurante", "Clínica dental", "Inmobiliaria"].map((n) => (
                  <button key={n} onClick={() => setNicho(n)} disabled={isLoading}
                    className="px-2 py-0.5 text-xs bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors disabled:opacity-50">
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Tono
              </label>
              <select
                value={tono}
                onChange={(e) => setTono(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {TONOS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !nicho.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold rounded-lg transition-colors"
          >
            {isLoading
              ? tipo === "organico"
                ? "Generando plan de contenido..."
                : "Generando flyers..."
              : tipo === "organico"
                ? "Generar Plan Semanal"
                : "Generar Flyers"}
          </button>
        </div>

        <AnalysisResult content={content} isLoading={isLoading} />
      </main>
    </div>
  );
}

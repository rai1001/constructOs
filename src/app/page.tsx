"use client";

import { useState, useCallback } from "react";
import Nav from "@/components/Nav";
import NicheInput from "@/components/NicheInput";
import AnalysisResult from "@/components/AnalysisResult";
import { useConstructor } from "@/lib/store";

export default function Home() {
  const { setNicho: setGlobalNicho } = useConstructor();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analyzedNiche, setAnalyzedNiche] = useState("");

  const handleAnalyze = useCallback(async (nicho: string) => {
    setIsLoading(true);
    setContent("");
    setAnalyzedNiche(nicho);
    setGlobalNicho(nicho);

    try {
      const response = await fetch("/api/analizar-nicho", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nicho }),
      });

      if (!response.ok) {
        const error = await response.json();
        setContent(`**Error:** ${error.error || "Error al analizar el nicho"}`);
        setIsLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        setContent("**Error:** No se pudo leer la respuesta");
        setIsLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setContent(accumulated);
      }
    } catch {
      setContent("**Error:** No se pudo conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Nav />

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Analiza tu nicho de mercado
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Introduce un sector y obtiene un analisis completo del mercado
            espanol: volumen, problemas, avatares, hooks y ofertas sugeridas.
          </p>
        </div>

        {/* Input */}
        <NicheInput onAnalyze={handleAnalyze} isLoading={isLoading} />

        {/* Result header */}
        {analyzedNiche && content && (
          <div className="mt-10 mb-2 text-center">
            <span className="text-sm text-zinc-500">
              Analisis para:{" "}
              <span className="text-blue-400 font-medium">{analyzedNiche}</span>
            </span>
          </div>
        )}

        {/* Results */}
        <AnalysisResult content={content} isLoading={isLoading} />
      </main>
    </div>
  );
}

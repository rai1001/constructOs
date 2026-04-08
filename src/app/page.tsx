"use client";

import { useCallback } from "react";
import Nav from "@/components/Nav";
import NicheInput from "@/components/NicheInput";
import AnalysisResult from "@/components/AnalysisResult";
import { useConstructor } from "@/lib/store";
import { useClaudeStream } from "@/lib/use-claude-stream";

export default function Home() {
  const { setNicho: setGlobalNicho } = useConstructor();
  const { content, isLoading, generate } = useClaudeStream("nicho");

  const handleAnalyze = useCallback(
    async (nicho: string) => {
      setGlobalNicho(nicho);
      await generate("/api/analizar-nicho", { nicho }, { nicho });
    },
    [setGlobalNicho, generate]
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Analiza tu nicho de mercado
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Introduce un sector y obtiene un analisis completo del mercado
            espanol: volumen, problemas, avatares, hooks y ofertas sugeridas.
          </p>
        </div>

        <NicheInput onAnalyze={handleAnalyze} isLoading={isLoading} />

        {content && (
          <div className="mt-10 mb-2 text-center">
            <span className="text-sm text-zinc-500">Analisis de nicho</span>
          </div>
        )}

        <AnalysisResult content={content} isLoading={isLoading} />
      </main>
    </div>
  );
}

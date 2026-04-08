"use client";

import { useState } from "react";

const NICHOS_SUGERIDOS = [
  "Restaurante",
  "Clínica dental",
  "Inmobiliaria",
  "Taller mecánico",
  "Clínica estética",
  "Academia / formación",
  "Gimnasio / CrossFit",
  "Peluquería / barbería",
  "Veterinaria",
  "Hotel / alojamiento rural",
];

interface NicheInputProps {
  onAnalyze: (nicho: string) => void;
  isLoading: boolean;
}

export default function NicheInput({ onAnalyze, isLoading }: NicheInputProps) {
  const [nicho, setNicho] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nicho.trim().length >= 2 && !isLoading) {
      onAnalyze(nicho.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNicho(suggestion);
    if (!isLoading) {
      onAnalyze(suggestion);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={nicho}
          onChange={(e) => setNicho(e.target.value)}
          placeholder="Ej: Clínica dental, Restaurante, Inmobiliaria..."
          className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || nicho.trim().length < 2}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
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
              Analizando...
            </span>
          ) : (
            "Analizar Nicho"
          )}
        </button>
      </form>

      <div className="mt-4">
        <p className="text-zinc-500 text-sm mb-2">Nichos sugeridos:</p>
        <div className="flex flex-wrap gap-2">
          {NICHOS_SUGERIDOS.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestionClick(s)}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded-full text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

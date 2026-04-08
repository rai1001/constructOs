"use client";

import { useState, useCallback, useEffect } from "react";
import { usePaso } from "./use-paso";

type PasoName =
  | "diagnostico"
  | "nicho"
  | "pricing"
  | "landing"
  | "agente"
  | "prospeccion"
  | "scripts"
  | "propuestas"
  | "contenido";

/**
 * Hook compartido para streaming de Claude + persistencia en proyecto.
 *
 * Reemplaza el patron repetido en 6+ paginas:
 *   fetch → reader.read() loop → setContent(acc) → guardar(acc)
 *
 * Uso:
 *   const { content, isLoading, generate } = useClaudeStream("nicho");
 *   generate("/api/analizar-nicho", { nicho }, { nicho });
 */
export function useClaudeStream(paso: PasoName) {
  const { guardar, cargar, tieneProyecto } = usePaso(paso);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Cargar output anterior del proyecto activo
  useEffect(() => {
    cargar().then((d) => {
      if (d) setContent(d.contenido);
    });
  }, [cargar]);

  const generate = useCallback(
    async (
      url: string,
      body: Record<string, unknown>,
      metadata?: Record<string, unknown>
    ): Promise<string> => {
      setIsLoading(true);
      setContent("");

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: res.statusText }));
          const msg = `**Error:** ${err.error || "Error del servidor"}`;
          setContent(msg);
          return "";
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setContent("**Error:** No se pudo leer la respuesta");
          return "";
        }

        const decoder = new TextDecoder();
        let acc = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setContent(acc);
        }

        if (tieneProyecto) guardar(acc, metadata);
        return acc;
      } catch {
        setContent("**Error:** No se pudo conectar con el servidor");
        return "";
      } finally {
        setIsLoading(false);
      }
    },
    [tieneProyecto, guardar]
  );

  return { content, setContent, isLoading, generate };
}

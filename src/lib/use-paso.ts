"use client";

import { useCallback } from "react";
import { useConstructor } from "./store";

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

interface PasoData {
  contenido: string;
  metadata?: Record<string, unknown>;
}

export function usePaso(paso: PasoName) {
  const { proyectoActivo } = useConstructor();

  const guardar = useCallback(
    async (contenido: string, metadata?: Record<string, unknown>) => {
      if (!proyectoActivo) return;
      try {
        await fetch("/api/pasos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proyecto_id: proyectoActivo.id,
            paso,
            contenido,
            metadata,
          }),
        });
      } catch {
        // Non-blocking — don't interrupt UX if save fails
      }
    },
    [proyectoActivo, paso]
  );

  const cargar = useCallback(async (): Promise<PasoData | null> => {
    if (!proyectoActivo) return null;
    try {
      const res = await fetch(
        `/api/pasos?proyecto_id=${proyectoActivo.id}&paso=${paso}`
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data
        ? { contenido: data.contenido, metadata: data.metadata }
        : null;
    } catch {
      return null;
    }
  }, [proyectoActivo, paso]);

  return { guardar, cargar, tieneProyecto: !!proyectoActivo };
}

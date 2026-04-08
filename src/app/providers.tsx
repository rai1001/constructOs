"use client";

import { useState, useEffect, useCallback, ReactNode } from "react";
import { ConstructorContext } from "@/lib/store";
import { Proyecto } from "@/lib/supabase";

const ACTIVE_PROJECT_KEY = "constructor-proyecto-activo-id";

export function Providers({ children }: { children: ReactNode }) {
  const [nicho, setNicho] = useState("");
  const [agencia, setAgencia] = useState("");
  const [proyectoActivo, setProyectoActivoState] = useState<Proyecto | null>(null);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);

  const refreshProyectos = useCallback(async () => {
    try {
      const res = await fetch("/api/proyectos");
      if (res.ok) {
        const data = await res.json();
        setProyectos(data as Proyecto[]);
        return data as Proyecto[];
      }
    } catch {
      // silently fail — proyectos list is non-critical
    }
    return [];
  }, []);

  const setProyectoActivo = useCallback((p: Proyecto | null) => {
    setProyectoActivoState(p);
    if (p) {
      localStorage.setItem(ACTIVE_PROJECT_KEY, p.id);
    } else {
      localStorage.removeItem(ACTIVE_PROJECT_KEY);
    }
  }, []);

  // Load projects and restore active project on mount
  useEffect(() => {
    refreshProyectos().then((list) => {
      const savedId = localStorage.getItem(ACTIVE_PROJECT_KEY);
      if (savedId && list.length > 0) {
        const found = list.find((p: Proyecto) => p.id === savedId);
        if (found) setProyectoActivoState(found);
      }
    });
  }, [refreshProyectos]);

  return (
    <ConstructorContext.Provider
      value={{
        nicho,
        setNicho,
        agencia,
        setAgencia,
        proyectoActivo,
        setProyectoActivo,
        proyectos,
        refreshProyectos,
      }}
    >
      {children}
    </ConstructorContext.Provider>
  );
}

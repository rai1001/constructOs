"use client";

import { createContext, useContext } from "react";
import { Proyecto } from "./supabase";

export interface ConstructorState {
  nicho: string;
  agencia: string;
  setNicho: (nicho: string) => void;
  setAgencia: (agencia: string) => void;
  // Proyecto activo
  proyectoActivo: Proyecto | null;
  setProyectoActivo: (p: Proyecto | null) => void;
  proyectos: Proyecto[];
  refreshProyectos: () => Promise<Proyecto[]>;
}

export const ConstructorContext = createContext<ConstructorState>({
  nicho: "",
  agencia: "",
  setNicho: () => {},
  setAgencia: () => {},
  proyectoActivo: null,
  setProyectoActivo: () => {},
  proyectos: [],
  refreshProyectos: async () => [],
});

export function useConstructor() {
  return useContext(ConstructorContext);
}

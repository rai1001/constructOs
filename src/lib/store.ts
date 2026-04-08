"use client";

import { createContext, useContext } from "react";

export interface ConstructorState {
  nicho: string;
  agencia: string;
  // Set from analysis or manual
  setNicho: (nicho: string) => void;
  setAgencia: (agencia: string) => void;
}

export const ConstructorContext = createContext<ConstructorState>({
  nicho: "",
  agencia: "",
  setNicho: () => {},
  setAgencia: () => {},
});

export function useConstructor() {
  return useContext(ConstructorContext);
}

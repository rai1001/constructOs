"use client";

import { useState, ReactNode } from "react";
import { ConstructorContext } from "@/lib/store";

export function Providers({ children }: { children: ReactNode }) {
  const [nicho, setNicho] = useState("");
  const [agencia, setAgencia] = useState("");

  return (
    <ConstructorContext.Provider value={{ nicho, setNicho, agencia, setAgencia }}>
      {children}
    </ConstructorContext.Provider>
  );
}

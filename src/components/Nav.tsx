"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MAPA = [
  { href: "/diagnostico", label: "Diagnóstico" },
  { href: "/", label: "Nicho" },
  { href: "/pricing", label: "Pricing" },
  { href: "/landing", label: "Landing" },
  { href: "/agente", label: "Agente" },
  { href: "/prospeccion", label: "Leads" },
  { href: "/scripts", label: "Scripts" },
  { href: "/propuestas", label: "Propuestas" },
  { href: "/contenido", label: "Contenido" },
  { href: "/proyectos", label: "Proyectos" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
            C
          </div>
          <span className="text-base font-semibold text-white hidden sm:block">
            El Constructor
          </span>
        </Link>
        <nav className="flex flex-wrap justify-end gap-0.5 text-xs">
          {MAPA.map((step) => (
            <Link
              key={step.href}
              href={step.href}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                pathname === step.href
                  ? "bg-zinc-800 text-white font-medium"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              {step.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

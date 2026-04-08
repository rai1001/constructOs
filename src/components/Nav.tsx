"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConstructor } from "@/lib/store";

const MAPA = [
  { href: "/diagnostico", label: "Diagnostico" },
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
  const { proyectoActivo, setProyectoActivo, proyectos } = useConstructor();

  return (
    <header className="border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
            C
          </div>
          <span className="text-base font-semibold text-white hidden sm:block">
            El Constructor
          </span>
        </Link>

        {/* Project selector */}
        {proyectos.length > 0 && (
          <select
            value={proyectoActivo?.id ?? ""}
            onChange={(e) => {
              const p = proyectos.find((p) => p.id === e.target.value) ?? null;
              setProyectoActivo(p);
            }}
            className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[180px] truncate"
          >
            <option value="">Sin proyecto</option>
            {proyectos
              .filter((p) => p.estado === "activo")
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
          </select>
        )}

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

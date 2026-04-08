"use client";

import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import { usePaso } from "@/lib/use-paso";

interface Prospect {
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  web: string;
  rating: number;
  resenas: number;
  estado: string;
}

const SECTORES = [
  "Restaurante",
  "Clínica dental",
  "Inmobiliaria",
  "Taller mecánico",
  "Clínica estética",
  "Peluquería",
  "Gimnasio",
  "Veterinaria",
];

const CIUDADES = [
  "A Coruña",
  "Madrid",
  "Barcelona",
  "Valencia",
  "Sevilla",
  "Málaga",
  "Bilbao",
  "Zaragoza",
];

export default function ProspeccionPage() {
  const [sector, setSector] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [results, setResults] = useState<Prospect[]>([]);
  const [totalEstimado, setTotalEstimado] = useState(0);
  const { guardar, cargar, tieneProyecto } = usePaso("prospeccion");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargar().then((d) => {
      if (d) { try { const p = JSON.parse(d.contenido); setResults(p.resultados || []); setTotalEstimado(p.total_estimado || 0); } catch {} }
    });
  }, [cargar]);

  const handleSearch = async () => {
    if (!sector.trim() || !ubicacion.trim()) return;
    setIsLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/prospectar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sector: sector.trim(), ubicacion: ubicacion.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al buscar");
      } else {
        setResults(data.resultados || []);
        setTotalEstimado(data.total_estimado || 0);
        if (tieneProyecto) guardar(JSON.stringify(data), { sector, ubicacion });
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = () => {
    if (!results.length) return;
    const headers = "Nombre,Dirección,Teléfono,Email,Web,Rating,Reseñas,Estado";
    const rows = results.map(
      (r) =>
        `"${r.nombre}","${r.direccion}","${r.telefono}","${r.email}","${r.web}",${r.rating},${r.resenas},"${r.estado}"`
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prospeccion_${sector}_${ubicacion}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Nav />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Prospeccion de Leads
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Busca negocios por sector y ciudad. Obtiene una lista con contacto
            directo para tu outreach.
          </p>
          <p className="text-xs text-zinc-600 mt-2">
            Datos simulados con IA — conecta con SignalCore/n8n para scraping
            real
          </p>
        </div>

        {/* Search form */}
        <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Sector
              </label>
              <input
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="Ej: Restaurante, Dentista..."
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SECTORES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSector(s)}
                    disabled={isLoading}
                    className="px-2 py-0.5 text-xs bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Ciudad / Provincia
              </label>
              <input
                type="text"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="Ej: Valencia, Madrid centro..."
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {CIUDADES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setUbicacion(c)}
                    disabled={isLoading}
                    className="px-2 py-0.5 text-xs bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={isLoading || !sector.trim() || !ubicacion.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold rounded-lg transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Buscando negocios...
              </span>
            ) : (
              "Buscar"
            )}
          </button>

          {error && <p className="mt-3 text-sm text-red-400">Error: {error}</p>}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {results.length} resultados encontrados
                </h2>
                <p className="text-sm text-zinc-500">
                  ~{totalEstimado} negocios estimados de {sector} en {ubicacion}
                </p>
              </div>
              <button
                onClick={exportCSV}
                className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Exportar CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    {["Nombre", "Dirección", "Teléfono", "Email", "Web", "Rating", "Estado"].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2.5 text-left font-semibold text-blue-400 bg-zinc-800/50 border border-zinc-700"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="hover:bg-zinc-800/30">
                      <td className="px-3 py-2.5 font-medium text-white border border-zinc-700">
                        {r.nombre}
                      </td>
                      <td className="px-3 py-2.5 text-zinc-400 border border-zinc-700">
                        {r.direccion}
                      </td>
                      <td className="px-3 py-2.5 text-zinc-300 border border-zinc-700 tabular-nums">
                        {r.telefono}
                      </td>
                      <td className="px-3 py-2.5 text-zinc-300 border border-zinc-700">
                        {r.email}
                      </td>
                      <td className="px-3 py-2.5 text-zinc-400 border border-zinc-700">
                        {r.web}
                      </td>
                      <td className="px-3 py-2.5 border border-zinc-700">
                        <span className="text-amber-400 font-medium">
                          {r.rating}
                        </span>
                        <span className="text-zinc-500 text-xs ml-1">
                          ({r.resenas})
                        </span>
                      </td>
                      <td className="px-3 py-2.5 border border-zinc-700">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            r.estado === "activo"
                              ? "bg-green-500/20 text-green-400"
                              : r.estado === "sin web"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {r.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Nav from "@/components/Nav";
import { supabase, Proyecto } from "@/lib/supabase";

const ESTADOS = {
  activo: { label: "Activo", color: "bg-green-500/20 text-green-400" },
  pausado: { label: "Pausado", color: "bg-amber-500/20 text-amber-400" },
  completado: { label: "Completado", color: "bg-blue-500/20 text-blue-400" },
};

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [nicho, setNicho] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchProyectos = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("proyectos")
      .select("*")
      .order("created_at", { ascending: false });

    if (err) {
      setError(
        err.message.includes("does not exist")
          ? "Tabla 'proyectos' no existe. Ejecuta el SQL en el dashboard de Supabase."
          : err.message
      );
    } else {
      setProyectos((data as Proyecto[]) || []);
      setError("");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProyectos();
  }, [fetchProyectos]);

  const handleCreate = async () => {
    if (!nombre.trim() || !nicho.trim() || saving) return;
    setSaving(true);
    const { error: err } = await supabase.from("proyectos").insert({
      nombre: nombre.trim(),
      nicho: nicho.trim(),
      estado: "activo",
      datos: {},
    });
    if (err) {
      setError(err.message);
    } else {
      setNombre("");
      setNicho("");
      setShowForm(false);
      fetchProyectos();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error: err } = await supabase
      .from("proyectos")
      .delete()
      .eq("id", id);
    if (!err) fetchProyectos();
  };

  const handleEstado = async (id: string, estado: string) => {
    const { error: err } = await supabase
      .from("proyectos")
      .update({ estado, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (!err) fetchProyectos();
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Mis Proyectos</h1>
            <p className="text-zinc-400 mt-1">
              Gestiona roadmaps por cliente y nicho
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            + Nuevo Proyecto
          </button>
        </div>

        {/* Error / SQL instructions */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-red-400 font-medium mb-2">Error: {error}</p>
            {error.includes("no existe") && (
              <div>
                <p className="text-zinc-400 text-sm mb-3">
                  Ejecuta este SQL en el SQL Editor de Supabase (supabase.com → tu proyecto → SQL Editor):
                </p>
                <pre className="bg-zinc-950 rounded-lg p-4 text-xs text-zinc-300 font-mono overflow-x-auto">
{`create table public.proyectos (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  nicho text not null,
  estado text default 'activo'
    check (estado in ('activo', 'pausado', 'completado')),
  datos jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.proyectos enable row level security;

create policy "Allow all for now" on public.proyectos
  for all using (true) with check (true);`}
                </pre>
                <button
                  onClick={fetchProyectos}
                  className="mt-3 px-4 py-2 bg-zinc-800 text-white text-sm rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Reintentar conexion
                </button>
              </div>
            )}
          </div>
        )}

        {/* New project form */}
        {showForm && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Nuevo Proyecto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Nombre del proyecto
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Clínica Dental Sonríe, Taberna El Rincón..."
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Nicho
                </label>
                <input
                  type="text"
                  value={nicho}
                  onChange={(e) => setNicho(e.target.value)}
                  placeholder="Ej: Restaurante, Clínica dental..."
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={saving || !nombre.trim() || !nicho.trim()}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-medium rounded-lg transition-colors"
              >
                {saving ? "Guardando..." : "Crear Proyecto"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && !error && (
          <div className="text-center py-12 text-zinc-500">Cargando proyectos...</div>
        )}

        {/* Empty state */}
        {!loading && !error && proyectos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg mb-2">
              No tienes proyectos aun
            </p>
            <p className="text-zinc-600 text-sm">
              Crea tu primer proyecto para empezar a gestionar clientes
            </p>
          </div>
        )}

        {/* Projects grid */}
        {proyectos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proyectos.map((p) => (
              <div
                key={p.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{p.nombre}</h3>
                    <p className="text-sm text-zinc-400">{p.nicho}</p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full ${ESTADOS[p.estado as keyof typeof ESTADOS]?.color}`}
                  >
                    {ESTADOS[p.estado as keyof typeof ESTADOS]?.label}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 mb-4">
                  Creado:{" "}
                  {new Date(p.created_at).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                <div className="flex items-center gap-2">
                  <select
                    value={p.estado}
                    onChange={(e) => handleEstado(p.id, e.target.value)}
                    className="flex-1 px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-xs text-white focus:outline-none"
                  >
                    <option value="activo">Activo</option>
                    <option value="pausado">Pausado</option>
                    <option value="completado">Completado</option>
                  </select>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-2 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

import { getSupabaseAdmin } from "@/lib/supabase-server";

const PASOS_VALIDOS = [
  "diagnostico",
  "nicho",
  "pricing",
  "landing",
  "agente",
  "prospeccion",
  "scripts",
  "propuestas",
  "contenido",
] as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const proyectoId = searchParams.get("proyecto_id");
  const paso = searchParams.get("paso");

  if (!proyectoId) {
    return Response.json({ error: "proyecto_id requerido" }, { status: 400 });
  }

  let query = getSupabaseAdmin()
    .from("proyecto_pasos")
    .select("*")
    .eq("proyecto_id", proyectoId)
    .order("created_at", { ascending: false });

  if (paso) {
    query = query.eq("paso", paso).limit(1);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(paso ? data?.[0] ?? null : data);
}

export async function POST(request: Request) {
  const { proyecto_id, paso, contenido, metadata } = await request.json();

  if (!proyecto_id || !paso || !contenido) {
    return Response.json(
      { error: "proyecto_id, paso y contenido son obligatorios" },
      { status: 400 }
    );
  }

  if (!PASOS_VALIDOS.includes(paso)) {
    return Response.json(
      { error: `Paso inválido. Válidos: ${PASOS_VALIDOS.join(", ")}` },
      { status: 400 }
    );
  }

  const { data, error } = await getSupabaseAdmin()
    .from("proyecto_pasos")
    .upsert(
      {
        proyecto_id,
        paso,
        contenido,
        metadata: metadata ?? {},
        updated_at: new Date().toISOString(),
      },
      { onConflict: "proyecto_id,paso" }
    )
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}

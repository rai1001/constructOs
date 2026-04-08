import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const { data, error } = await getSupabaseAdmin()
    .from("proyectos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function POST(request: Request) {
  const { nombre, nicho } = await request.json();

  if (!nombre?.trim() || !nicho?.trim()) {
    return Response.json(
      { error: "Nombre y nicho son obligatorios" },
      { status: 400 }
    );
  }

  const { data, error } = await getSupabaseAdmin()
    .from("proyectos")
    .insert({ nombre: nombre.trim(), nicho: nicho.trim(), estado: "activo", datos: {} })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}

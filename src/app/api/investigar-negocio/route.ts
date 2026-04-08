import { createClaudeJSON } from "@/lib/claude-stream";

const SYSTEM_PROMPT = `Eres un investigador de negocios. Busca información sobre un negocio español a partir de su nombre, URL o descripción breve.

Responde ÚNICAMENTE con un JSON válido (sin markdown, sin backticks):

{
  "nombreNegocio": "Nombre oficial",
  "nicho": "Sector",
  "servicios": "Lista de servicios separados por coma",
  "horario": "Horario estimado",
  "ubicacion": "Dirección o ciudad",
  "descripcion": "Breve descripción (1-2 frases)",
  "telefono": "Teléfono o vacío",
  "web": "URL o vacío",
  "resenas": "Resumen reseñas o vacío",
  "competidores": "2-3 competidores locales o vacío"
}

Si no encuentras info específica, usa datos típicos del sector y marca "(estimado)".`;

export async function POST(request: Request) {
  const { query } = await request.json();

  if (!query || typeof query !== "string" || query.trim().length < 3) {
    return Response.json(
      { error: "Introduce al menos el nombre del negocio" },
      { status: 400 }
    );
  }

  try {
    const text = await createClaudeJSON(
      SYSTEM_PROMPT,
      `Investiga este negocio en España: "${query.trim()}"`,
      1024
    );
    const data = JSON.parse(text);
    return Response.json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return Response.json({ error: msg }, { status: 500 });
  }
}

import { createClaudeJSON } from "@/lib/claude-stream";

const SYSTEM_PROMPT = `Eres un scraper de negocios españoles. Generas listas realistas de negocios basándote en sector y ubicación.

Responde ÚNICAMENTE con JSON válido (sin markdown, sin backticks):

{
  "total_estimado": 150,
  "resultados": [
    {
      "nombre": "Nombre del negocio",
      "direccion": "Dirección completa",
      "telefono": "6XX XXX XXX o 9XX XXX XXX",
      "email": "contacto@dominio.es",
      "web": "www.dominio.es",
      "rating": 4.2,
      "resenas": 85,
      "estado": "activo"
    }
  ]
}

REGLAS: 15 resultados, nombres realistas para España, direcciones con calles reales, teléfonos formato español, ratings 3.0-5.0, mayoría "activo" con algunos "sin web" o "sin email".`;

export async function POST(request: Request) {
  const { sector, ubicacion } = await request.json();

  if (!sector || !ubicacion) {
    return Response.json(
      { error: "Sector y ubicación son obligatorios" },
      { status: 400 }
    );
  }

  try {
    const text = await createClaudeJSON(
      SYSTEM_PROMPT,
      `Busca negocios de tipo "${sector.trim()}" en "${ubicacion.trim()}", España.`
    );
    const data = JSON.parse(text);
    return Response.json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return Response.json({ error: msg }, { status: 500 });
  }
}

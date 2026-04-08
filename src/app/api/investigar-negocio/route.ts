import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `Eres un investigador de negocios. Tu trabajo es buscar información sobre un negocio español a partir de su nombre, URL o descripción breve.

Responde ÚNICAMENTE con un JSON válido (sin markdown, sin backticks) con esta estructura:

{
  "nombreNegocio": "Nombre oficial del negocio",
  "nicho": "Sector (ej: Restaurante, Clínica dental, Inmobiliaria)",
  "servicios": "Lista de servicios principales separados por coma",
  "horario": "Horario de apertura estimado",
  "ubicacion": "Dirección o ciudad",
  "descripcion": "Breve descripción del negocio (1-2 frases)",
  "telefono": "Teléfono si lo encuentras, o vacío",
  "web": "URL si la encuentras, o vacío",
  "resenas": "Resumen de reseñas/reputación si hay info disponible, o vacío",
  "competidores": "2-3 competidores locales si los detectas, o vacío"
}

Si no encuentras información específica, usa datos típicos del sector en España como estimación y márcalo como "(estimado)".
El JSON debe ser válido y parseable.`;

export async function POST(request: Request) {
  const { query } = await request.json();

  if (!query || typeof query !== "string" || query.trim().length < 3) {
    return Response.json(
      { error: "Introduce al menos el nombre del negocio" },
      { status: 400 }
    );
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Investiga este negocio en España y extrae toda la información que puedas: "${query.trim()}"`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    const data = JSON.parse(text);
    return Response.json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return Response.json({ error: msg }, { status: 500 });
  }
}

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `Eres un scraper de negocios españoles. Generas listas realistas de negocios reales o verosímiles basándote en el sector y ubicación.

Responde ÚNICAMENTE con un JSON válido (sin markdown, sin backticks) con esta estructura:

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

REGLAS:
- Genera exactamente 15 resultados por búsqueda
- Nombres de negocios realistas para España (no inventados absurdos)
- Direcciones con calles reales de la ciudad indicada
- Teléfonos con formato español (6XX para móvil, 9XX para fijo)
- Emails con dominios plausibles (.es, .com)
- Ratings entre 3.0 y 5.0
- total_estimado es una estimación del total de negocios de ese tipo en esa zona
- Varía los estados: la mayoría "activo", algunos "sin web", alguno "sin email"
- El JSON debe ser válido y parseable`;

export async function POST(request: Request) {
  const { sector, ubicacion } = await request.json();

  if (!sector || !ubicacion) {
    return Response.json(
      { error: "Sector y ubicación son obligatorios" },
      { status: 400 }
    );
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Busca negocios de tipo "${sector.trim()}" en "${ubicacion.trim()}", España.`,
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

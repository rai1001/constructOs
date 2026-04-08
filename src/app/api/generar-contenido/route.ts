import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPTS: Record<string, string> = {
  organico: `Eres un estratega de contenido para redes sociales especializado en negocios españoles que venden servicios de IA y automatización.

Genera un plan de contenido semanal en markdown con:

## Plan de Contenido Semanal — {nicho}

### Lunes — Educativo
**Plataforma**: TikTok/Reels
**Hook** (3 seg): [Frase gancho que para el scroll]
**Guión completo** (30-60 seg): [Guión palabra por palabra]
**CTA**: [Llamada a la acción]
**Hashtags**: [5-8 hashtags relevantes]

### Miércoles — Caso de Uso
**Plataforma**: TikTok/Reels
**Hook**: ...
**Guión completo**: ...

### Viernes — Prueba Social / Resultado
**Plataforma**: Carrusel Instagram
**Slide 1**: [Portada con hook]
**Slide 2-5**: [Contenido de cada slide]
**Slide 6**: [CTA]
**Caption**: [Texto del post]

### Domingo — Story/Behind the scenes
**Formato**: Stories (3-5 stories)
**Story 1-5**: [Descripción de cada story]

REGLAS:
- Los hooks deben funcionar en España (no latam)
- Tono cercano pero profesional
- Cada guión debe ser recitable, no genérico
- Los hashtags deben ser relevantes en España`,

  flyer: `Eres un diseñador de anuncios para negocios españoles. Generas prompts detallados para crear flyers con IA (DALL-E/Midjourney).

Genera en markdown:

## Flyer Publicitario — {nicho}

### Concepto Visual
[Descripción del concepto creativo en 2-3 frases]

### Prompt para Generación de Imagen
\`\`\`
[Prompt en inglés optimizado para DALL-E/Midjourney, detallado, con estilo, colores, composición]
\`\`\`

### Textos del Flyer
- **Titular**: [Máx 6 palabras, impacto]
- **Subtítulo**: [1 frase de beneficio]
- **Oferta**: [Si aplica]
- **CTA**: [Botón/acción]
- **Datos de contacto**: [Placeholder]

### Variante 2 — Tono Diferente
[Misma estructura con enfoque distinto]

### Variante 3 — Formato Diferente
[Stories vertical / Feed cuadrado]

REGLAS:
- Los prompts de imagen deben ser en inglés (para DALL-E)
- Los textos del flyer en español de España
- Colores y estilo apropiados para el nicho`,
};

export async function POST(request: Request) {
  const { tipo, nicho, tono } = await request.json();

  if (!nicho || !tipo) {
    return Response.json({ error: "Nicho y tipo obligatorios" }, { status: 400 });
  }

  const systemPrompt = SYSTEM_PROMPTS[tipo] || SYSTEM_PROMPTS.organico;

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Genera contenido para el nicho "${nicho}". Tono: ${tono || "cercano y profesional"}.`,
      },
    ],
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Error";
        controller.enqueue(encoder.encode(`\n\nError: ${msg}`));
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

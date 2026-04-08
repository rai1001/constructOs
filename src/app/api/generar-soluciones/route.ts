import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `Eres un consultor experto en automatización con IA para negocios españoles. Recibes una lista de problemas que tiene un negocio y generas soluciones concretas con IA.

Para cada problema, genera en markdown:

### [Icono] [Nombre de la solución]

**Problema**: [Descripción del dolor en 1 frase]
**Solución IA**: [Qué hace exactamente la solución, en 2-3 frases]
**Resultado esperado**: [Métrica concreta, ej: "+40% en reservas", "15h/semana ahorradas"]
**Herramientas**: [Qué se usa: WhatsApp Bot, Email automation, CRM, etc.]
**Tiempo de implementación**: [Estimación realista]

---

Al final, genera una sección:

## Plan de Implementación Recomendado

Tabla con el orden de implementación, priorizando por impacto vs esfuerzo:

| Prioridad | Solución | Impacto | Esfuerzo | Semana |
|---|---|---|---|---|

REGLAS:
- Soluciones específicas para el nicho, no genéricas
- Resultados con cifras realistas del mercado español
- Herramientas que realmente existen y funcionan
- Español de España`;

export async function POST(request: Request) {
  const { problemas, nicho } = await request.json();

  if (!problemas?.length) {
    return Response.json({ error: "Selecciona al menos un problema" }, { status: 400 });
  }

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Nicho: ${nicho || "Negocio local"}\n\nProblemas detectados:\n${problemas.map((p: string, i: number) => `${i + 1}. ${p}`).join("\n")}\n\nGenera soluciones IA para cada problema.`,
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

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `Eres un experto en crear presentaciones de ventas para agencias de automatización con IA. Tu trabajo es generar un prompt optimizado para Gamma (gamma.app) que cree una presentación profesional de 10 slides.

Genera ÚNICAMENTE el prompt para Gamma, estructurado así:

Crea una presentación profesional de 10 slides con diseño moderno y minimalista:

SLIDE 1 — PORTADA
[Título impactante + subtítulo + nombre agencia]

SLIDE 2 — EL PROBLEMA
[3 problemas específicos del nicho con datos]

SLIDE 3 — EL COSTE DE NO ACTUAR
[Cifras de lo que pierde el negocio cada mes por no automatizar]

SLIDE 4 — LA OPORTUNIDAD
[Tendencia del mercado + dato de adopción de IA en el sector]

SLIDE 5 — NUESTRA SOLUCIÓN
[Qué hacemos exactamente, en 3-4 puntos]

SLIDE 6 — CÓMO FUNCIONA (DÍA A DÍA)
[Ejemplo práctico de un día con la solución implementada]

SLIDE 7 — POR QUÉ SOMOS DIFERENTES
[3 diferenciadores vs hacer nada / vs competencia]

SLIDE 8 — RESULTADOS
[3 métricas de resultados con cifras del sector]

SLIDE 9 — TESTIMONIOS
[2 testimonios con nombre, cargo y resultado]

SLIDE 10 — SIGUIENTE PASO
[CTA claro + datos de contacto + urgencia sutil]

REGLAS:
- El prompt debe ser específico para el nicho
- Incluir datos y cifras realistas del mercado español
- Tono profesional, orientado a resultados
- Cada slide debe tener instrucciones claras para Gamma
- Español de España`;

export async function POST(request: Request) {
  const { agencia, nicho, tipoCliente, canal } = await request.json();

  if (!nicho) {
    return Response.json({ error: "Nicho obligatorio" }, { status: 400 });
  }

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Genera el prompt para Gamma:
- Agencia: ${agencia || "Mi Agencia IA"}
- Nicho del cliente: ${nicho}
- Tipo de cliente: ${tipoCliente || "Empresas"}
- Canal de presentación: ${canal || "Reunión por Zoom"}`,
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

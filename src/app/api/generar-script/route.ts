import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `Eres un experto en ventas B2B de servicios de automatización con IA para negocios españoles. Generas scripts de venta profesionales.

Genera un script completo en markdown con estas secciones:

## Script de Llamada en Frío

### Apertura (15 segundos)
Saludo + presentación + hook de valor inmediato. Sin pedir permiso, ir al grano.

### Diagnóstico Rápido (30 segundos)
2-3 preguntas que exponen el dolor del nicho. Preguntas que solo se pueden responder con "sí".

### Presentación de Valor (30 segundos)
Beneficio principal + dato concreto + caso de éxito del sector.

### Manejo de Objeciones
Las 5 objeciones más comunes del nicho con rebatimiento específico:
- "No tengo presupuesto" → ...
- "Ya tenemos algo" → ...
- "No me interesa" → ...
- "Envíame info por email" → ...
- [Objeción específica del nicho] → ...

### Cierre
Propuesta de siguiente paso + alternativa si dice que no.

---

## Script de WhatsApp (Primer Mensaje)
3 variantes de primer mensaje para contacto en frío por WhatsApp. Cortos, naturales, con hook.

---

## Script de Seguimiento
3 mensajes de seguimiento (día 2, día 5, día 10) para leads que no respondieron.

---

## Email de Presentación
Email completo para enviar tras la llamada. Subject + body. Máximo 150 palabras.

REGLAS:
- Español de España, tono profesional pero cercano
- Datos y cifras específicas del nicho
- Sin frases genéricas ("solución innovadora", "líder del sector")
- Los scripts deben sonar naturales, como los diría un closer real
- Incluir variables: {nombre_lead}, {nombre_negocio}, {ciudad}`;

export async function POST(request: Request) {
  const { nicho, servicio } = await request.json();

  if (!nicho) {
    return Response.json({ error: "Nicho obligatorio" }, { status: 400 });
  }

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Genera scripts de venta para una agencia que vende ${servicio || "automatización con IA"} a negocios del sector "${nicho}" en España.`,
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

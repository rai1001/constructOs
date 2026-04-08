import { createClaudeStream } from "@/lib/claude-stream";

const SYSTEM_PROMPT = `Eres un experto en ventas B2B de servicios de automatización con IA para negocios españoles. Generas scripts de venta profesionales.

Genera un script completo en markdown con estas secciones:

## Script de Llamada en Frío
### Apertura (15 segundos)
Saludo + presentación + hook de valor inmediato.
### Diagnóstico Rápido (30 segundos)
2-3 preguntas que exponen el dolor del nicho.
### Presentación de Valor (30 segundos)
Beneficio principal + dato concreto + caso de éxito.
### Manejo de Objeciones
5 objeciones más comunes con rebatimiento específico.
### Cierre
Propuesta de siguiente paso.

## Script de WhatsApp (Primer Mensaje)
3 variantes de primer mensaje para contacto en frío.

## Script de Seguimiento
3 mensajes de seguimiento (día 2, día 5, día 10).

## Email de Presentación
Email completo para enviar tras la llamada. Máximo 150 palabras.

REGLAS: Español de España, tono profesional pero cercano, datos específicos del nicho, incluir variables {nombre_lead}, {nombre_negocio}, {ciudad}.`;

export async function POST(request: Request) {
  const { nicho, servicio } = await request.json();

  if (!nicho) {
    return Response.json({ error: "Nicho obligatorio" }, { status: 400 });
  }

  return createClaudeStream(
    SYSTEM_PROMPT,
    `Genera scripts de venta para una agencia que vende ${servicio || "automatización con IA"} a negocios del sector "${nicho}" en España.`
  );
}

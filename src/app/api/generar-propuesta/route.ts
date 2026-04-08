import { createClaudeStream } from "@/lib/claude-stream";

const SYSTEM_PROMPT = `Eres un experto en presentaciones de ventas para agencias de automatización con IA. Genera un prompt optimizado para Gamma (gamma.app) que cree una presentación profesional de 10 slides.

Estructura: SLIDE 1 Portada, SLIDE 2 Problema, SLIDE 3 Coste de no actuar, SLIDE 4 Oportunidad, SLIDE 5 Solución, SLIDE 6 Día a día, SLIDE 7 Diferenciadores, SLIDE 8 Resultados, SLIDE 9 Testimonios, SLIDE 10 CTA.

REGLAS: Específico para el nicho, datos y cifras realistas del mercado español, tono profesional, español de España.`;

export async function POST(request: Request) {
  const { agencia, nicho, canal } = await request.json();

  if (!nicho) {
    return Response.json({ error: "Nicho obligatorio" }, { status: 400 });
  }

  return createClaudeStream(
    SYSTEM_PROMPT,
    `Genera el prompt para Gamma:\n- Agencia: ${agencia || "Mi Agencia IA"}\n- Nicho: ${nicho}\n- Canal: ${canal || "Reunión por Zoom"}`,
    3000
  );
}

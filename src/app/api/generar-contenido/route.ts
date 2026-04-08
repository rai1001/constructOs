import { createClaudeStream } from "@/lib/claude-stream";

const PROMPTS: Record<string, string> = {
  organico: `Eres un estratega de contenido para redes sociales especializado en negocios españoles de IA y automatización. Genera un plan de contenido semanal en markdown con: Lunes (Educativo TikTok/Reels con hook+guión+CTA+hashtags), Miércoles (Caso de Uso), Viernes (Carrusel Instagram 6 slides), Domingo (Stories). Cada guión debe ser recitable. Hooks que funcionen en España. Tono cercano pero profesional.`,
  flyer: `Eres un diseñador de anuncios para negocios españoles. Generas prompts detallados para crear flyers con IA. Incluye: Concepto Visual, Prompt para DALL-E/Midjourney (en inglés), Textos del Flyer (titular, subtítulo, oferta, CTA en español), y 3 variantes con diferentes tonos/formatos.`,
};

export async function POST(request: Request) {
  const { tipo, nicho, tono } = await request.json();

  if (!nicho || !tipo) {
    return Response.json({ error: "Nicho y tipo obligatorios" }, { status: 400 });
  }

  return createClaudeStream(
    PROMPTS[tipo] || PROMPTS.organico,
    `Genera contenido para el nicho "${nicho}". Tono: ${tono || "cercano y profesional"}.`
  );
}

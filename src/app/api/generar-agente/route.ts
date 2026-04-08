import { createClaudeStream } from "@/lib/claude-stream";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts/generar-agente";

export async function POST(request: Request) {
  const config = await request.json();

  if (!config.nombreNegocio || !config.nicho) {
    return Response.json(
      { error: "Nombre del negocio y nicho son obligatorios" },
      { status: 400 }
    );
  }

  return createClaudeStream(SYSTEM_PROMPT, buildUserPrompt(config));
}

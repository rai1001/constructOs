import { createClaudeJSON } from "@/lib/claude-stream";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts/generar-landing";

export async function POST(request: Request) {
  const { agencia, nicho } = await request.json();

  if (!agencia || !nicho) {
    return Response.json(
      { error: "Agencia y nicho son obligatorios" },
      { status: 400 }
    );
  }

  try {
    const text = await createClaudeJSON(
      SYSTEM_PROMPT,
      buildUserPrompt(agencia.trim(), nicho.trim())
    );
    const landing = JSON.parse(text);
    return Response.json(landing);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return Response.json({ error: msg }, { status: 500 });
  }
}

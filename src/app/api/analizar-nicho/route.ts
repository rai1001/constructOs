import { createClaudeStream } from "@/lib/claude-stream";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts/analizar-nicho";

export async function POST(request: Request) {
  const { nicho } = await request.json();

  if (!nicho || typeof nicho !== "string" || nicho.trim().length < 2) {
    return Response.json(
      { error: "El nicho es obligatorio (mínimo 2 caracteres)" },
      { status: 400 }
    );
  }

  return createClaudeStream(SYSTEM_PROMPT, buildUserPrompt(nicho.trim()));
}

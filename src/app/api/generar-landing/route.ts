import Anthropic from "@anthropic-ai/sdk";
import {
  SYSTEM_PROMPT,
  buildUserPrompt,
} from "@/lib/prompts/generar-landing";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const { agencia, nicho } = await request.json();

  if (!agencia || !nicho) {
    return Response.json(
      { error: "Agencia y nicho son obligatorios" },
      { status: 400 }
    );
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        { role: "user", content: buildUserPrompt(agencia.trim(), nicho.trim()) },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON response
    const landing = JSON.parse(text);
    return Response.json(landing);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return Response.json({ error: msg }, { status: 500 });
  }
}

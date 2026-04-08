import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts/analizar-nicho";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const { nicho } = await request.json();

  if (!nicho || typeof nicho !== "string" || nicho.trim().length < 2) {
    return Response.json(
      { error: "El nicho es obligatorio (mínimo 2 caracteres)" },
      { status: 400 }
    );
  }

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(nicho.trim()) }],
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error desconocido";
        controller.enqueue(encoder.encode(`\n\n**Error:** ${message}`));
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}

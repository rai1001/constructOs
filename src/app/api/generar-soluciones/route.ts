import { createClaudeStream } from "@/lib/claude-stream";

const SYSTEM_PROMPT = `Eres un consultor experto en automatización con IA para negocios españoles. Recibes una lista de problemas y generas soluciones concretas con IA.

Para cada problema, genera en markdown:
### [Nombre de la solución]
**Problema**: [1 frase]
**Solución IA**: [2-3 frases]
**Resultado esperado**: [Métrica concreta]
**Herramientas**: [Qué se usa]
**Tiempo de implementación**: [Estimación]

---

Al final:
## Plan de Implementación Recomendado
| Prioridad | Solución | Impacto | Esfuerzo | Semana |

REGLAS: Soluciones específicas para el nicho, resultados con cifras realistas del mercado español, español de España.`;

export async function POST(request: Request) {
  const { problemas, nicho } = await request.json();

  if (!problemas?.length) {
    return Response.json({ error: "Selecciona al menos un problema" }, { status: 400 });
  }

  return createClaudeStream(
    SYSTEM_PROMPT,
    `Nicho: ${nicho || "Negocio local"}\n\nProblemas detectados:\n${problemas.map((p: string, i: number) => `${i + 1}. ${p}`).join("\n")}\n\nGenera soluciones IA para cada problema.`
  );
}

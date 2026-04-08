"use client";

import { useMemo } from "react";

interface AnalysisResultProps {
  content: string;
  isLoading: boolean;
}

function parseMarkdownTable(tableStr: string): {
  headers: string[];
  rows: string[][];
} {
  const lines = tableStr
    .trim()
    .split("\n")
    .filter((l) => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };

  const parseRow = (line: string) =>
    line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);

  const headers = parseRow(lines[0]);
  const rows = lines
    .slice(2) // skip header + separator
    .map(parseRow)
    .filter((r) => r.length > 0);

  return { headers, rows };
}

function RenderedSection({ section }: { section: string }) {
  // Check if section contains a markdown table
  const tableMatch = section.match(
    /\|.+\|[\s\S]*?\|[-\s|]+\|[\s\S]*?(?:\|.+\|[\s]*)+/
  );

  if (tableMatch) {
    const beforeTable = section.slice(0, tableMatch.index);
    const afterTable = section.slice(
      (tableMatch.index || 0) + tableMatch[0].length
    );
    const { headers, rows } = parseMarkdownTable(tableMatch[0]);

    return (
      <div>
        {beforeTable && <FormattedText text={beforeTable} />}
        {headers.length > 0 && (
          <div className="overflow-x-auto mt-3">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {headers.map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left text-sm font-semibold text-blue-400 bg-zinc-800/50 border border-zinc-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-800/30">
                    {row.map((cell, j) => {
                      const formatted = cell.replace(
                        /\*\*(.+?)\*\*/g,
                        '<strong class="text-white font-semibold">$1</strong>'
                      );
                      return (
                      <td
                        key={j}
                        className="px-4 py-3 text-sm text-zinc-300 border border-zinc-700"
                        dangerouslySetInnerHTML={{ __html: formatted }}
                      />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {afterTable && <FormattedText text={afterTable} />}
      </div>
    );
  }

  return <FormattedText text={section} />;
}

function FormattedText({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;

        // Bold text: **text**
        const formatted = trimmed.replace(
          /\*\*(.+?)\*\*/g,
          '<strong class="text-white font-semibold">$1</strong>'
        );

        // List items
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          return (
            <div key={i} className="flex gap-2 text-zinc-300 pl-2">
              <span className="text-blue-400 mt-0.5 shrink-0">-</span>
              <span dangerouslySetInnerHTML={{ __html: formatted.slice(2) }} />
            </div>
          );
        }

        // Numbered lists
        const numberedMatch = trimmed.match(/^(\d+)\.\s(.+)/);
        if (numberedMatch) {
          const rest = numberedMatch[2].replace(
            /\*\*(.+?)\*\*/g,
            '<strong class="text-white font-semibold">$1</strong>'
          );
          return (
            <div key={i} className="flex gap-2 text-zinc-300 pl-2">
              <span className="text-blue-400 shrink-0">
                {numberedMatch[1]}.
              </span>
              <span dangerouslySetInnerHTML={{ __html: rest }} />
            </div>
          );
        }

        // H3: ### text
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="text-lg font-semibold text-white mt-4 mb-1"
            >
              {trimmed.slice(4)}
            </h3>
          );
        }

        // Regular paragraph
        return (
          <p
            key={i}
            className="text-zinc-300"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      })}
    </div>
  );
}

const SECTION_ICONS: Record<string, string> = {
  "volumen": "📊",
  "problemas": "🔥",
  "capacidad": "💰",
  "avatares": "🎯",
  "mensajes": "📢",
  "hooks": "📢",
  "ofertas": "🏷️",
};

function getSectionIcon(title: string): string {
  const lower = title.toLowerCase();
  for (const [key, icon] of Object.entries(SECTION_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "📋";
}

export default function AnalysisResult({
  content,
  isLoading,
}: AnalysisResultProps) {
  const sections = useMemo(() => {
    if (!content) return [];

    // Split by ## headers
    const parts = content.split(/^## /m).filter(Boolean);
    return parts.map((part) => {
      const firstNewline = part.indexOf("\n");
      const title =
        firstNewline > -1 ? part.slice(0, firstNewline).trim() : part.trim();
      const body = firstNewline > -1 ? part.slice(firstNewline + 1).trim() : "";
      // Remove emoji from title for clean display
      const cleanTitle = title.replace(/^[\p{Emoji}\s]+/u, "").trim();
      return { title: cleanTitle, icon: getSectionIcon(title), body };
    });
  }, [content]);

  if (!content && !isLoading) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-4">
      {sections.map((section, i) => (
        <div
          key={i}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>{section.icon}</span>
            <span>{section.title}</span>
          </h2>
          <RenderedSection section={section.body} />
        </div>
      ))}

      {isLoading && (
        <div className="flex items-center gap-3 text-zinc-400 p-4">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
          </div>
          <span>Analizando el mercado español...</span>
        </div>
      )}
    </div>
  );
}

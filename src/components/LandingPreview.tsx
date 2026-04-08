"use client";

interface LandingData {
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
    stats: { value: string; label: string }[];
  };
  problema: {
    title: string;
    items: { icon: string; title: string; description: string }[];
  };
  solucion: {
    title: string;
    subtitle: string;
    features: { title: string; description: string }[];
  };
  proceso: {
    title: string;
    steps: { step: string; title: string; description: string }[];
  };
  testimonios: {
    nombre: string;
    cargo: string;
    texto: string;
    resultado: string;
  }[];
  faq: { pregunta: string; respuesta: string }[];
  ctaFinal: { title: string; subtitle: string; cta: string };
}

interface LandingPreviewProps {
  data: LandingData;
  agencia: string;
}

const ICONS: Record<string, string> = {
  clock: "&#128337;",
  users: "&#128101;",
  "trending-down": "&#128200;",
  "phone-missed": "&#128222;",
  calendar: "&#128197;",
  euro: "&#128176;",
  mail: "&#9993;",
  shield: "&#128737;",
  zap: "&#9889;",
  "bar-chart": "&#128202;",
};

function Icon({ name }: { name: string }) {
  return (
    <span
      className="text-2xl"
      dangerouslySetInnerHTML={{ __html: ICONS[name] || "&#9679;" }}
    />
  );
}

export default function LandingPreview({ data, agencia }: LandingPreviewProps) {
  return (
    <div className="bg-white text-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-200">
      {/* Navbar */}
      <div className="bg-zinc-900 text-white px-8 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">{agencia}</span>
        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium">
          {data.hero.cta}
        </button>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-900 text-white px-8 py-20 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
          {data.hero.headline}
        </h1>
        <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
          {data.hero.subheadline}
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
          {data.hero.cta}
        </button>
        <div className="mt-12 flex justify-center gap-8 md:gap-16">
          {data.hero.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-bold text-blue-400">{stat.value}</p>
              <p className="text-sm text-zinc-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Problema */}
      <div className="px-8 py-16 bg-zinc-50">
        <h2 className="text-2xl font-bold text-center mb-10">
          {data.problema.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {data.problema.items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm"
            >
              <Icon name={item.icon} />
              <h3 className="font-semibold mt-3 mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Solución */}
      <div className="px-8 py-16">
        <h2 className="text-2xl font-bold text-center mb-2">
          {data.solucion.title}
        </h2>
        <p className="text-center text-zinc-500 mb-10">
          {data.solucion.subtitle}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {data.solucion.features.map((f, i) => (
            <div key={i} className="flex gap-4 p-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold shrink-0">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-zinc-600">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proceso */}
      <div className="px-8 py-16 bg-zinc-50">
        <h2 className="text-2xl font-bold text-center mb-10">
          {data.proceso.title}
        </h2>
        <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
          {data.proceso.steps.map((s, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {s.step}
              </div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-zinc-600">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonios */}
      <div className="px-8 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">
          Lo que dicen nuestros clientes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {data.testimonios.map((t, i) => (
            <div
              key={i}
              className="bg-zinc-50 rounded-xl p-6 border border-zinc-200"
            >
              <p className="text-zinc-700 italic mb-4">
                &ldquo;{t.texto}&rdquo;
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="font-semibold">{t.nombre}</p>
                  <p className="text-sm text-zinc-500">{t.cargo}</p>
                </div>
                <span className="text-sm font-bold text-green-600">
                  {t.resultado}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="px-8 py-16 bg-zinc-50">
        <h2 className="text-2xl font-bold text-center mb-10">
          Preguntas frecuentes
        </h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {data.faq.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-5 border border-zinc-200"
            >
              <h3 className="font-semibold mb-2">{f.pregunta}</h3>
              <p className="text-sm text-zinc-600">{f.respuesta}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-16 text-center">
        <h2 className="text-3xl font-bold mb-3">{data.ctaFinal.title}</h2>
        <p className="text-lg text-blue-100 mb-8">{data.ctaFinal.subtitle}</p>
        <button className="bg-white text-blue-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-zinc-100 transition-colors">
          {data.ctaFinal.cta}
        </button>
      </div>

      {/* Footer */}
      <div className="bg-zinc-900 text-zinc-400 px-8 py-6 text-center text-sm">
        &copy; 2026 {agencia}. Todos los derechos reservados.
      </div>
    </div>
  );
}

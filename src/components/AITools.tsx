import { Brain, Shield, FileText, Sparkles } from 'lucide-react';

interface AIToolsProps {
  onOpenTool: (tool: string) => void;
}

export default function AITools({ onOpenTool }: AIToolsProps) {
  const tools = [
    {
      id: 'explain',
      icon: Brain,
      title: 'AI Crypto Explainer',
      description: 'Wytłumaczenie projektu kryptowalutowego w prostym, zrozumiałym języku',
      color: 'text-cyan',
    },
    {
      id: 'risk',
      icon: Shield,
      title: 'AI Risk Overview',
      description: 'Ocena ryzyk technologicznych i ogólnych (bez porad inwestycyjnych)',
      color: 'text-purple',
    },
    {
      id: 'summary',
      icon: Sparkles,
      title: 'AI Market Summary',
      description: 'Neutralne, edukacyjne streszczenie wydarzeń rynkowych',
      color: 'text-cyan',
    },
    {
      id: 'whitepaper',
      icon: FileText,
      title: 'AI Simplified Whitepaper',
      description: 'Uproszczone streszczenie fragmentu technicznego whitepapera',
      color: 'text-purple',
    },
  ];

  return (
    <section id="tools" className="py-20 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Darmowe Narzędzia AI</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Inteligentne narzędzia, które tłumaczą skomplikowane koncepcje krypto w prosty sposób
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => onOpenTool(tool.id)}
                className="tool-card group"
              >
                <div className={`${tool.color} mb-4 transition-transform group-hover:scale-110`}>
                  <Icon size={48} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{tool.title}</h3>
                <p className="text-gray-400 mb-6">{tool.description}</p>
                <button className="btn-secondary text-sm px-6 py-2">
                  Otwórz narzędzie
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="glassmorphism rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-gray-300">
              <strong className="text-cyan">Ważne:</strong> Wszystkie narzędzia AI mają charakter wyłącznie edukacyjny.
              Nie udzielamy porad inwestycyjnych ani rekomendacji zakupu/sprzedaży.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
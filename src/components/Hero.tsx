import { Bitcoin } from 'lucide-react';

interface HeroProps {
  onOpenEbook: () => void;
}

export default function Hero({ onOpenEbook }: HeroProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center hero-gradient pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-6 floating-animation">
            <Bitcoin size={64} className="text-cyan" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">CryptoTrend</span>
            <br />
            <span className="text-white text-3xl md:text-5xl">zrozum rynek kryptowalut bez chaosu</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Analizator Trendów Krypto + dane w czasie rzeczywistym + średnie kroczące.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a href="https://app.cryptotrend.pl" target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
              <span>Uruchom Analizator Rynku</span>
            </a>
            <button onClick={onOpenEbook} className="btn-secondary">
              Pobierz darmowy rozdział e-booka
            </button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2 text-cyan">Proste wyjaśnienia</h3>
              <p className="text-gray-400 text-sm">Projekty krypto bez żargonu</p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold mb-2 text-cyan">AI tłumacz</h3>
              <p className="text-gray-400 text-sm">Whitepapery prostym językiem</p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2 text-cyan">Czytelne wykresy</h3>
              <p className="text-gray-400 text-sm">Narzędzia analizy</p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-lg font-semibold mb-2 text-cyan">100% edukacja</h3>
              <p className="text-gray-400 text-sm">Zero porad inwestycyjnych</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
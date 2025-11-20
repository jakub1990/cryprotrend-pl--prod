import { BarChart3, TrendingUp, LineChart } from 'lucide-react';

export default function MarketAnalyzer() {
  return (
    <section className="py-20 bg-dark-lighter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Analizator Rynku Kryptowalut</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Narzędzie do analizy trendów i zmian cenowych
          </p>
        </div>

        <div className="card max-w-4xl mx-auto p-8">
          <div className="flex items-center justify-center mb-6">
            <BarChart3 size={80} className="text-cyan" />
          </div>

          <h3 className="text-3xl font-bold text-center mb-6 text-gradient">
            Analizator Trendów Krypto
          </h3>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <TrendingUp className="mx-auto mb-3 text-cyan" size={40} />
              <h4 className="font-semibold text-lg mb-2">Dane w czasie rzeczywistym</h4>
              <p className="text-gray-400 text-sm">Aktualne ceny i historie kryptowalut</p>
            </div>

            <div className="text-center">
              <LineChart className="mx-auto mb-3 text-cyan" size={40} />
              <h4 className="font-semibold text-lg mb-2">Średnie kroczące</h4>
              <p className="text-gray-400 text-sm">MA20 i MA50 z sygnałami trendu</p>
            </div>

            <div className="text-center">
              <BarChart3 className="mx-auto mb-3 text-cyan" size={40} />
              <h4 className="font-semibold text-lg mb-2">Porównania</h4>
              <p className="text-gray-400 text-sm">Zestawiaj różne kryptowaluty</p>
            </div>
          </div>

          <div className="text-center">
            <a href="https://app.cryptotrend.pl" target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
              <span>Uruchom Analizator</span>
            </a>
            <p className="text-gray-400 text-sm mt-4">
              Dostęp natychmiastowy, bez rejestracji
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
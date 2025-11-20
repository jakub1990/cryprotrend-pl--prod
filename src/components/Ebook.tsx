import { BookOpen, Download, CheckCircle } from 'lucide-react';

interface EbookProps {
  onDownloadSample: () => void;
  onPurchase: () => void;
}

export default function Ebook({ onDownloadSample, onPurchase }: EbookProps) {
  return (
    <section id="ebook" className="py-20 bg-dark-lighter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="card p-8 bg-gradient-to-br from-cyan/10 to-purple/10">
              <div className="flex items-center justify-center mb-6">
                <BookOpen size={120} className="text-cyan" />
              </div>
              <div className="text-center">
                <div className="inline-block px-4 py-2 bg-cyan/20 rounded-full text-cyan text-sm font-semibold mb-4">
                  E-BOOK 2026
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="section-title">
              Krypto 2026: Zrozumieć rynek
            </h2>

            <p className="text-xl text-gray-300 mb-8">
              Kompleksowy przewodnik po świecie kryptowalut dla każdego, kto chce zrozumieć technologię,
              rynek i mechanizmy bez zbędnego żargonu.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle className="text-cyan mr-3 flex-shrink-0 mt-1" size={24} />
                <span className="text-gray-300">
                  Podstawy blockchain i kryptowalut wyjaśnione prostym językiem
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-cyan mr-3 flex-shrink-0 mt-1" size={24} />
                <span className="text-gray-300">
                  Jak czytać projekty krypto i unikać najczęstszych pułapek
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-cyan mr-3 flex-shrink-0 mt-1" size={24} />
                <span className="text-gray-300">
                  Narzędzia i strategie do samodzielnej analizy rynku
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-cyan mr-3 flex-shrink-0 mt-1" size={24} />
                <span className="text-gray-300">
                  Bezpieczeństwo, portfele i ochrona przed oszustwami
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-cyan mr-3 flex-shrink-0 mt-1" size={24} />
                <span className="text-gray-300">
                  Prawdziwe case studies projektów udanych i nieudanych
                </span>
              </div>
            </div>

            <div className="glassmorphism rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-cyan">Spis treści:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Wprowadzenie</li>
                <li>Podstawy technologii blockchain</li>
                <li>Rodzaje kryptowalut i ich zastosowania</li>
                <li>Jak czytać whitepaper i analizować projekty</li>
                <li>Narzędzia i wskaźniki analizy rynku</li>
                <li>Najczęstsze błędy i jak ich unikać</li>
                <li>Psychologia inwestowania w krypto</li>
                <li>Web3, DeFi i NFT - nowe możliwości</li>
                <li>Przyszłość kryptowalut - trendy 2026</li>
                <li>Podsumowanie: 10 zasad inwestora krypto</li>
                <li>Zakończenie</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onPurchase} className="btn-primary flex items-center justify-center gap-2">
                <span>Kup teraz - 19,99 zł</span>
              </button>
              <button onClick={onDownloadSample} className="btn-secondary flex items-center justify-center gap-2">
                <Download size={20} />
                <span>Pobierz darmowy rozdział</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import { AlertTriangle, Mail } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
}

export default function Footer({ onOpenPrivacy }: FooterProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-dark-lighter border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gradient mb-4">CryptoTrend</h3>
            <p className="text-gray-400 text-sm">
              Edukacja i narzędzia do zrozumienia rynku kryptowalut
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Nawigacja</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="https://app.cryptotrend.pl" target="_blank" rel="noopener noreferrer" className="hover:text-cyan transition-colors">
                  Analizator Rynku
                </a>
              </li>
              <li>
                <button onClick={() => scrollToSection('tools')} className="hover:text-cyan transition-colors">
                  Narzędzia AI
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('ebook')} className="hover:text-cyan transition-colors">
                  E-book
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Informacje</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-cyan transition-colors">
                  Polityka prywatności
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Kontakt</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <a href="mailto:kontakt@cryptotrend.pl" className="flex items-center hover:text-cyan transition-colors">
                <Mail size={16} className="mr-2" />
                kontakt@cryptotrend.pl
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="glassmorphism rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="text-cyan mr-3 flex-shrink-0 mt-1" size={24} />
              <p className="text-gray-300 text-sm">
                <strong className="text-white">Ważne ostrzeżenie:</strong> CryptoTrend.pl ma charakter wyłącznie edukacyjny.
                Nie udzielamy porad inwestycyjnych, nie rekomendujemy kupna ani sprzedaży jakichkolwiek aktywów.
                Wszelkie decyzje inwestycyjne podejmujesz na własną odpowiedzialność.
              </p>
            </div>
          </div>

          <p className="text-center text-gray-400 text-sm">
            © 2025 CryptoTrend.pl - Wszystkie prawa zastrzeżone
          </p>
        </div>
      </div>
    </footer>
  );
}
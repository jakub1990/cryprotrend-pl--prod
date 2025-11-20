import { X } from 'lucide-react';

interface PrivacyPolicyProps {
  onClose: () => void;
}

export default function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-dark-lighter border border-gray-800 rounded-2xl max-w-4xl w-full my-8 relative max-h-[90vh] flex flex-col">
        <div className="flex-shrink-0 bg-dark-lighter border-b border-gray-800 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gradient">Polityka Prywatności</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Zamknij"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-white mb-3">1. Informacje ogólne</h3>
            <p className="mb-2">
              Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych użytkowników
              serwisu CryptoTrend.pl (dalej: "Serwis").
            </p>
            <p>
              Administratorem danych osobowych jest właściciel serwisu CryptoTrend.pl.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-3">2. Rodzaje zbieranych danych</h3>
            <p className="mb-2">Serwis może zbierać następujące dane:</p>
            <ul className="list-disc space-y-1 ml-6">
              <li>Adres e-mail (w przypadku zapisu do newslettera)</li>
              <li>Dane techniczne (adres IP, typ przeglądarki, system operacyjny)</li>
              <li>Informacje o aktywności w serwisie (pliki cookies)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-3">3. Cele przetwarzania danych</h3>
            <p className="mb-2">Dane osobowe są przetwarzane w celu:</p>
            <ul className="list-disc space-y-1 ml-6">
              <li>Świadczenia usług dostępnych w Serwisie</li>
              <li>Wysyłki newslettera (za wyraźną zgodą użytkownika)</li>
              <li>Analizy statystycznej i poprawy funkcjonalności Serwisu</li>
              <li>Zapewnienia bezpieczeństwa i wykrywania nadużyć</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-3">4. Pliki cookies</h3>
            <p className="mb-2">
              Serwis wykorzystuje pliki cookies (ciasteczka) w celu:
            </p>
            <ul className="list-disc space-y-1 ml-6">
              <li>Zapamiętania preferencji użytkownika</li>
              <li>Prowadzenia analiz statystycznych</li>
              <li>Zapewnienia prawidłowego działania Serwisu</li>
            </ul>
            <p className="mt-2">
              Użytkownik może w każdej chwili zmienić ustawienia cookies w swojej przeglądarce.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-3">5. Udostępnianie danych</h3>
            <p>
              Dane osobowe użytkowników nie są sprzedawane ani udostępniane podmiotom trzecim,
              z wyjątkiem sytuacji przewidzianych prawem lub za wyraźną zgodą użytkownika.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-3">6. Prawa użytkownika</h3>
            <p className="mb-2">Użytkownik ma prawo do:</p>
            <ul className="list-disc space-y-1 ml-6">
              <li>Dostępu do swoich danych osobowych</li>
              <li>Sprostowania (poprawiania) swoich danych</li>
              <li>Usunięcia danych (prawo do bycia zapomnianym)</li>
              <li>Ograniczenia przetwarzania danych</li>
              <li>Przenoszenia danych</li>
              <li>Wniesienia sprzeciwu wobec przetwarzania danych</li>
              <li>Cofnięcia zgody w dowolnym momencie</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-3">7. Bezpieczeństwo danych</h3>
            <p>
              Administrator stosuje odpowiednie środki techniczne i organizacyjne zapewniające
              ochronę przetwarzanych danych osobowych odpowiednią do zagrożeń oraz kategorii
              danych objętych ochroną.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-3">8. Zmiany Polityki Prywatności</h3>
            <p>
              Administrator zastrzega sobie prawo do wprowadzania zmian w Polityce Prywatności.
              Aktualna wersja Polityki Prywatności jest zawsze dostępna w Serwisie.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-3">9. Kontakt</h3>
            <p>
              W sprawach dotyczących ochrony danych osobowych prosimy o kontakt pod adresem e-mail: <a href="mailto:kontakt@cryptotrend.pl" className="text-cyan hover:underline">kontakt@cryptotrend.pl</a>
            </p>
          </section>

          <div className="text-sm text-gray-400 pt-4 border-t border-gray-800">
            <p>Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}</p>
          </div>
        </div>

        <div className="flex-shrink-0 bg-dark-lighter border-t border-gray-800 p-6 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full btn-primary"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}

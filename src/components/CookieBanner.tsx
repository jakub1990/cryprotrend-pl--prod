import { useState, useEffect } from 'react';

interface CookieBannerProps {
  onOpenPrivacy: () => void;
}

export default function CookieBanner({ onOpenPrivacy }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-dark-lighter border-t border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-300">
              Ta strona używa plików cookies w celu zapewnienia prawidłowego działania serwisu oraz w celach analitycznych.
              Korzystając z witryny, wyrażasz zgodę na używanie cookies zgodnie z ustawieniami Twojej przeglądarki.
              <button
                onClick={onOpenPrivacy}
                className="text-cyan hover:underline ml-1 cursor-pointer"
              >
                Polityka prywatności
              </button>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Odrzuć
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 bg-cyan text-dark font-semibold rounded-lg hover:bg-cyan/90 transition-all text-sm"
            >
              Akceptuję
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

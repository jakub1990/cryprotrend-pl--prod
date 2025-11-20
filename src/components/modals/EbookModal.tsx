import { X, Download, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface EbookModalProps {
  onClose: () => void;
}

export default function EbookModal({ onClose }: EbookModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/send-free-chapter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error sending free chapter:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send email. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gradient mb-2">Pobierz darmowy rozdział</h2>
            <p className="text-gray-400">E-book: Krypto 2026</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        {status === 'idle' || status === 'loading' || status === 'error' ? (
          <>
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Otrzymasz pierwszy rozdział e-booka "Krypto 2026: Zrozumieć rynek"
                bezpośrednio na swoją skrzynkę email.
              </p>
              <div className="glassmorphism rounded-lg p-4">
                <h4 className="font-semibold text-cyan mb-2">Co zawiera darmowy rozdział:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="text-cyan mr-2 flex-shrink-0 mt-0.5" size={16} />
                    <span>Wprowadzenie do świata kryptowalut</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-cyan mr-2 flex-shrink-0 mt-0.5" size={16} />
                    <span>Podstawy technologii blockchain</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-cyan mr-2 flex-shrink-0 mt-0.5" size={16} />
                    <span>Najważniejsze koncepcje wyjaśnione prosto</span>
                  </li>
                </ul>
              </div>
            </div>

            {status === 'error' && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Twój adres email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="twoj@email.com"
                  className="input-field"
                  required
                  disabled={status === 'loading'}
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Wysyłanie...</span>
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    <span>Wyślij mi darmowy rozdział</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-gray-400 text-xs mt-4 text-center">
              Nie wysyłamy spamu. Możesz zrezygnować w każdej chwili.
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <CheckCircle size={64} className="text-cyan mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Dziękujemy!</h3>
            <p className="text-gray-300">
              Sprawdź swoją skrzynkę email. Darmowy rozdział został wysłany.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
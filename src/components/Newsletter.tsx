import { Mail, Send } from 'lucide-react';
import { useState } from 'react';

export default function Newsletter() {
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
      const response = await fetch(`${supabaseUrl}/functions/v1/newsletter-subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to subscribe. Please try again.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section className="py-20 bg-dark-lighter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glassmorphism rounded-2xl p-8 md:p-12 text-center">
          <Mail size={60} className="mx-auto mb-6 text-cyan" />

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Raz w tygodniu — proste podsumowanie rynku krypto
          </h2>

          <p className="text-xl text-gray-300 mb-8">
            Otrzymuj najważniejsze informacje bez nadmiaru szczegółów. Bez spamu, bez porad inwestycyjnych.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Twój adres email"
                className="input-field flex-1"
                required
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Wysyłanie...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Dołącz</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {status === 'success' && (
            <p className="mt-4 text-cyan font-semibold">
              Dziękujemy! Sprawdź swoją skrzynkę email.
            </p>
          )}

          {status === 'error' && (
            <p className="mt-4 text-red-400 font-semibold">
              {errorMessage}
            </p>
          )}

          <p className="text-gray-400 text-sm mt-6">
            Możesz zrezygnować w każdej chwili. Szanujemy Twoją prywatność.
          </p>
        </div>
      </div>
    </section>
  );
}
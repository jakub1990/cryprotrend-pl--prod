import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/update-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Wystąpił nieoczekiwany błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700">
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-gray-300 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót do logowania
        </Link>

        <h1 className="text-2xl font-bold text-white mb-2">Resetuj hasło</h1>
        <p className="text-gray-300 mb-6">
          Wprowadź swój adres email, a wyślemy Ci link do resetowania hasła.
        </p>

        {success ? (
          <Alert className="bg-green-900/20 border-green-700">
            <AlertDescription className="text-green-300">
              Email z linkiem do resetowania hasła został wysłany. Sprawdź swoją skrzynkę pocztową.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Wprowadź swój email"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Wysyłanie...' : 'Wyślij link resetujący'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

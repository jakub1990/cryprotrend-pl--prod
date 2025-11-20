import { X, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface AIToolModalProps {
  title: string;
  description: string;
  placeholder: string;
  endpoint: string;
  onClose: () => void;
}

export default function AIToolModal({ title, description, placeholder, endpoint, onClose }: AIToolModalProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setOutput('');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();
      setOutput(data.output || data.message || 'Brak odpowiedzi');
    } catch (error) {
      setOutput('Wystąpił błąd podczas generowania odpowiedzi. Spróbuj ponownie.');
      console.error('AI Tool Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gradient mb-2">{title}</h2>
            <p className="text-gray-400">{description}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Wprowadź dane:
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              rows={4}
              className="input-field resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Generowanie...</span>
              </>
            ) : (
              <span>Generuj</span>
            )}
          </button>

          {(output || loading) && (
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Wynik:
              </label>
              <div className="output-box">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-cyan" size={32} />
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{output}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 glassmorphism rounded-lg p-4">
          <p className="text-gray-400 text-sm">
            <strong className="text-cyan">Uwaga:</strong> To narzędzie ma charakter wyłącznie edukacyjny.
            Nie stanowi porady inwestycyjnej.
          </p>
        </div>
      </div>
    </div>
  );
}
import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Michał K.',
      role: 'Początkujący inwestor',
      content: 'Wreszcie ktoś wyjaśnia krypto bez skomplikowanych terminów. Narzędzia AI są genialnie proste i naprawdę pomagają zrozumieć projekty.',
      rating: 5,
    },
    {
      name: 'Anna W.',
      role: 'Entuzjastka technologii',
      content: 'Analizator rynku to coś czego szukałam od dawna. Czytelne wykresy i przejrzyste dane bez zbędnego szumu.',
      rating: 5,
    },
    {
      name: 'Piotr S.',
      role: 'Programista',
      content: 'E-book to świetne kompendium wiedzy. Nawet jako osoba techniczna znalazłem wiele wartościowych informacji o analizie projektów krypto.',
      rating: 5,
    },
    {
      name: 'Karolina M.',
      role: 'Studentka ekonomii',
      content: 'Narzędzie do upraszczania whitepaperów oszczędza mi mnóstwo czasu. Wreszcie mogę szybko zrozumieć o co chodzi w projekcie.',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Co mówią użytkownicy</h2>
          <p className="text-xl text-gray-300">
            Opinie osób, które korzystają z CryptoTrend
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="text-cyan fill-cyan" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
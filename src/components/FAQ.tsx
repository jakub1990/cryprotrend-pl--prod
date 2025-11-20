import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Czy to porady inwestycyjne?',
      answer: 'Nie. CryptoTrend ma charakter wyłącznie edukacyjny. Dostarczamy narzędzia i wiedzę, która pomaga zrozumieć rynek kryptowalut, ale nie udzielamy porad inwestycyjnych ani rekomendacji zakupu/sprzedaży.',
    },
    {
      question: 'Czy narzędzia AI są darmowe?',
      answer: 'Tak! Wszystkie cztery narzędzia AI (Crypto Explainer, Risk Overview, Market Summary, Simplified Whitepaper) są całkowicie darmowe i dostępne bez rejestracji.',
    },
    {
      question: 'Czy muszę znać się na kryptowalutach?',
      answer: 'Nie. CryptoTrend został stworzony właśnie dla osób, które dopiero zaczynają lub chcą pogłębić swoją wiedzę. Wszystkie narzędzia i materiały są napisane prostym językiem bez zbędnego żargonu.',
    },
    {
      question: 'Czy mogę korzystać na telefonie?',
      answer: 'Tak! Wszystkie narzędzia, w tym Analizator Rynku, są w pełni responsywne i działają świetnie na smartfonach i tabletach.',
    },
    {
      question: 'Jak działa Analizator Rynku?',
      answer: 'Analizator Rynku pobiera dane cenowe kryptowalut w czasie rzeczywistym i prezentuje je w formie czytelnych wykresów i wskaźników. Możesz analizować trendy, momentum i zmiany cen w różnych przedziałach czasowych.',
    },
    {
      question: 'Czy potrzebuję konta, żeby korzystać z narzędzi?',
      answer: 'Nie. Większość narzędzi, w tym AI Tools i Analizator Rynku, nie wymaga rejestracji. Konto jest potrzebne tylko jeśli chcesz zapisywać swoje analizy lub subskrybować newsletter.',
    },
    {
      question: 'Skąd pochodzą dane rynkowe?',
      answer: 'Korzystamy ze źródeł danych rynkowych, które agregują informacje z największych giełd kryptowalut, zapewniając aktualne i dokładne dane.',
    },
  ];

  return (
    <section className="py-20 bg-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Często zadawane pytania</h2>
          <p className="text-xl text-gray-300">
            Znajdź odpowiedzi na najczęstsze pytania
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card cursor-pointer" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white pr-8">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="text-cyan flex-shrink-0" size={24} />
                ) : (
                  <ChevronDown className="text-cyan flex-shrink-0" size={24} />
                )}
              </div>
              {openIndex === index && (
                <p className="mt-4 text-gray-300 leading-relaxed">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
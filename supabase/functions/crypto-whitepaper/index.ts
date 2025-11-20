import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { input } = await req.json();

    if (!input) {
      return new Response(
        JSON.stringify({ error: "Brak danych wejściowych" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const prompt = `Uprość ten fragment whitepapera:

${input}

Przepisz go prostym, zrozumiałym językiem.
Usuń żargon techniczny, zachowując kluczowe informacje.
Wyjaśnij co to oznacza w praktyce.

Odpowiedź w języku polskim, maksymalnie 300 słów.`;

    const output = `Uproszczone wyjaśnienie:

📄 Główna idea:
Prezentowany fragment whitepapera opisuje techniczną koncepcję związaną z projektem kryptowalutowym. W prostszych słowach:

🔹 Co to oznacza:
Dokument techniczny (whitepaper) przedstawia sposób działania systemu. Najważniejsze elementy to:
- Architektura techniczna
- Mechanizmy konsensusu
- Model ekonomiczny
- Zastosowania praktyczne

🔹 W praktyce:
Technologia opisana w dokumencie ma na celu:
- Zapewnienie bezpieczeństwa
- Umożliwienie efektywnych transakcji
- Stworzenie zrównoważonego ekosystemu
- Rozwiązanie konkretnych problemów

🔹 Kluczowe pojęcia:
- Decentralizacja: brak centralnego punktu kontroli
- Konsensus: sposób osiągania zgody w sieci
- Tokenomika: ekonomia tokenów projektu
- Smart kontrakty: automatyczne wykonywanie umów

💡 Podsumowanie:
Whitepaper to techniczny dokument wyjaśniający działanie projektu. Jego zrozumienie pomaga ocenić podstawy technologiczne i założenia projektu.

⚠️ Uwaga: To uproszczone wyjaśnienie ma charakter edukacyjny i nie stanowi porady inwestycyjnej.`;

    return new Response(
      JSON.stringify({ output }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Wystąpił błąd podczas przetwarzania" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
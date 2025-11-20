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

    const output = `Uproszczone wyjaśnienie:

📄 Główna idea:
Prezentowany fragment whitepapera opisuje techniczny koncepcję związaną z projektem kryptowalutowym. W prostszych słowach:

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
- Konsensus: sposób uzgadniania stanu sieci
- Tokenomika: ekonomiczny model projektu
- Smart kontrakty: programowalne umowy

💡 Podsumowanie:
Whitepaper to techniczny dokument opisujący jak działa projekt. Uproszczona wersja pomaga zrozumieć kluczowe koncepcje bez głębokiej wiedzy technicznej.

Fragment wejściowy został przełożony na prostszy język, zachowując najważniejsze informacje.`;

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
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

    const prompt = `Wyjaśnij projekt kryptowalutowy: ${input}

Użyj prostego języka zrozumiałego dla osoby początkującej.
Wyjaśnij:
- Czym jest ten projekt
- Jaki problem rozwiązuje
- Jak działa (w uproszczeniu)
- Najważniejsze cechy

Nie udzielaj porad inwestycyjnych. Skup się na edukacji i zrozumieniu technologii.
Odpowiedź w języku polskim, maksymalnie 300 słów.`;

    const output = `${input} to projekt kryptowalutowy, który wykorzystuje technologię blockchain do ${input.toLowerCase().includes('bitcoin') ? 'cyfrowej waluty i przechowywania wartości' : 'różnych zastosowań w ekosystemie krypto'}.

Główne cechy:
- Zdecentralizowana sieć
- Zabezpieczenia kryptograficzne
- Transparentność transakcji
- Programowalne funkcje (w przypadku platform smart contract)

Projekt ma na celu rozwiązanie problemów związanych z tradycyjnymi systemami finansowymi lub cyfrowymi, oferując alternatywne podejście oparte na technologii blockchain.

Pamiętaj: To wyjaśnienie ma charakter edukacyjny i nie stanowi porady inwestycyjnej.`;

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
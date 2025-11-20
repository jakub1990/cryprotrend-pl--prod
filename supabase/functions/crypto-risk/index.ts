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

    const prompt = `Oceń ryzyka związane z projektem: ${input}

Przeanalizuj:
- Ryzyka technologiczne
- Ryzyka związane z adopcją
- Ryzyka regulacyjne
- Potencjalne wyzwania

To ma być obiektywna analiza edukacyjna, NIE porada inwestycyjna.
Odpowiedź w języku polskim, maksymalnie 300 słów.`;

    const output = `Analiza ryzyk dla: ${input}

🔴 Ryzyka technologiczne:
- Bezpieczeństwo smart kontraktów i kodu
- Skalowalność sieci
- Podatność na ataki

🟡 Ryzyka adopcji:
- Konkurencja na rynku
- Akceptacja przez użytkowników
- Wsparcie społeczności deweloperów

🟠 Ryzyka regulacyjne:
- Zmieniające się przepisy prawne
- Różnice regulacyjne między krajami
- Potencjalne ograniczenia

⚠️ Uwaga: To obiektywna analiza edukacyjna różnych kategorii ryzyka. Każdy projekt kryptowalutowy wiąże się z ryzykiem. Ta analiza NIE jest poradą inwestycyjną.

Ważne: Przed podjęciem jakichkolwiek decyzji, przeprowadź własne badania (DYOR - Do Your Own Research).`;

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
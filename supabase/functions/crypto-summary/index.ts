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

    const output = `Podsumowanie rynkowe: ${input}

📊 Ogólny kontekst:
Rynek kryptowalut charakteryzuje się wysoką zmiennością i dynamicznymi zmianami. Różne czynniki wpływają na rozwój ekosystemu, w tym:

- Adopcja instytucjonalna
- Rozwój technologiczny
- Zmiany regulacyjne
- Innowacje w przestrzeni DeFi i Web3

🔍 Kluczowe trendy:
- Rosnące zainteresowanie blockchain w różnych sektorach
- Ewolucja technologii i protokołów
- Zwiększona uwaga regulatorów na całym świecie
- Rozwój infrastruktury i narzędzi dla użytkowników

💡 Kontekst edukacyjny:
Zrozumienie mechanizmów rynkowych wymaga analizy wielu czynników. Rynek kryptowalut jest młody i rozwija się, co wiąże się zarówno z możliwościami jak i wyzwaniami.

⚠️ Przypomnienie: To streszczenie ma charakter wyłącznie edukacyjny i informacyjny. Nie stanowi porady inwestycyjnej ani rekomendacji.`;

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
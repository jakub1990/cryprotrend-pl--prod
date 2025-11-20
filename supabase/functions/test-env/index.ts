import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const allEnv = Deno.env.toObject();
  const envKeys = Object.keys(allEnv);

  const info = {
    timestamp: new Date().toISOString(),
    hasResendKey: !!resendApiKey,
    keyLength: resendApiKey?.length || 0,
    keyPrefix: resendApiKey?.substring(0, 8) || 'none',
    hasStripeKey: !!stripeKey,
    stripeKeyLength: stripeKey?.length || 0,
    stripeKeyPrefix: stripeKey?.substring(0, 7) || 'none',
    hasSupabaseUrl: !!supabaseUrl,
    totalEnvVars: envKeys.length,
    envVarNames: envKeys.sort(),
  };

  return new Response(
    JSON.stringify(info, null, 2),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
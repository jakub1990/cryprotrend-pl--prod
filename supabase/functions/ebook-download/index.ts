import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

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

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const isValidateRequest = url.pathname.includes('/validate');

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: downloadToken, error: tokenError } = await supabase
      .from('download_tokens')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (tokenError || !downloadToken) {
      return new Response(
        JSON.stringify({ error: 'Nieprawid\u0142owy lub nieaktywny token' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (new Date(downloadToken.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'Token wygas\u0142' }),
        {
          status: 410,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (downloadToken.download_count >= downloadToken.max_downloads) {
      return new Response(
        JSON.stringify({ error: 'Osi\u0105gni\u0119to limit pobra\u0144' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    await supabase
      .from('download_tokens')
      .update({ download_count: downloadToken.download_count + 1 })
      .eq('id', downloadToken.id);

    if (isValidateRequest) {
      return new Response(
        JSON.stringify({
          success: true,
          remaining: downloadToken.max_downloads - downloadToken.download_count - 1,
          max_downloads: downloadToken.max_downloads,
          expires_at: downloadToken.expires_at
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': 'https://cryptotrend.pl/krypto2026-zrozumiec-rynek.pdf',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
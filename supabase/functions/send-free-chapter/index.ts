import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  console.log("Request received:", req.method, req.url);
  
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS preflight");
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      console.log("Method not allowed:", req.method);
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { email } = await req.json();
    console.log("Processing email:", email);

    if (!email || !email.includes("@")) {
      console.log("Invalid email:", email);
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Inserting into database...");
    const { data: ebookRequest, error: dbError } = await supabase
      .from("ebook_requests")
      .insert({
        email: email.toLowerCase().trim(),
        product_type: "free_chapter",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save request" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Database insert successful, sending email...");
    const emailSent = await sendFreeChapterEmail(email, ebookRequest.id);

    if (emailSent) {
      await supabase
        .from("ebook_requests")
        .update({ sent_at: new Date().toISOString() })
        .eq("id", ebookRequest.id);

      console.info(`Email sent successfully to: ${email}`);
    } else {
      await supabase
        .from("ebook_requests")
        .update({ 
          error_message: "Email sending failed - will retry",
          retry_count: 1
        })
        .eq("id", ebookRequest.id);

      console.warn(`Email not sent to: ${email}`);
    }

    console.log("Returning success response");
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Żądanie zostało zapisane. Wkrótce otrzymasz email z darmowym rozdziałem."
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function sendFreeChapterEmail(email: string, requestId: string): Promise<boolean> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: secretData } = await supabase
      .from("app_secrets")
      .select("value")
      .eq("key", "RESEND_API_KEY")
      .maybeSingle();

    const resendApiKey = secretData?.value || Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY not configured in database or environment");
      return false;
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff;
          }
          .header { 
            background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .content { 
            padding: 40px 30px;
          }
          .content h2 {
            color: #0ea5e9;
            font-size: 24px;
            margin-top: 0;
          }
          .content p {
            color: #4b5563;
            font-size: 16px;
            line-height: 1.7;
          }
          .button { 
            display: inline-block; 
            background: #0ea5e9; 
            color: white !important; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 24px 0;
            font-weight: 600;
            font-size: 16px;
          }
          .button:hover {
            background: #0284c7;
          }
          .footer { 
            background-color: #f9fafb;
            text-align: center; 
            padding: 30px; 
            color: #6b7280; 
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
          }
          .important { 
            background: #fef3c7; 
            padding: 20px; 
            border-radius: 8px; 
            border-left: 4px solid #f59e0b; 
            margin: 24px 0;
          }
          .important strong {
            color: #92400e;
          }
          .features {
            background-color: #f0f9ff;
            padding: 24px;
            border-radius: 8px;
            margin: 24px 0;
          }
          .features ul {
            list-style: none;
            padding: 0;
            margin: 12px 0 0 0;
          }
          .features li {
            padding: 8px 0;
            color: #1e40af;
          }
          .features li:before {
            content: "✓ ";
            color: #0ea5e9;
            font-weight: bold;
            margin-right: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Twój darmowy rozdział jest gotowy!</h1>
          </div>
          <div class="content">
            <h2>Witaj w CryptoTrend.pl</h2>
            
            <p>Dziękujemy za zainteresowanie naszym e-bookiem <strong>"Krypto 2026: Zrozumieć rynek"</strong>.</p>

            <div class="features">
              <strong style="color: #0ea5e9; font-size: 18px;">Co znajdziesz w darmowym rozdziale:</strong>
              <ul>
                <li>Wprowadzenie do świata kryptowalut</li>
                <li>Podstawy technologii blockchain wyjaśnione prosto</li>
                <li>Najważniejsze koncepcje bez zbędnego żargonu</li>
                <li>Przygotowanie do dalszej nauki</li>
              </ul>
            </div>

            <p style="text-align: center;">
              <a href="https://cryptotrend-jakub.netlify.app/ebook-krypto-2026.html" class="button">📖 Czytaj darmowy rozdział online</a>
            </p>

            <div class="important">
              <strong>💡 Podobał Ci się rozdział?</strong><br>
              Pełny e-book zawiera 11 rozdziałów pełnych praktycznej wiedzy, narzędzi i strategii, które pomogą Ci zrozumieć rynek kryptowalut. Dostępny za jedyne <strong>19,99 zł</strong>.
            </div>

            <p>Jeśli masz jakiekolwiek pytania, śmiało napisz do nas na <a href="mailto:kontakt@cryptotrend.pl" style="color: #0ea5e9;">kontakt@cryptotrend.pl</a>.</p>

            <p style="margin-top: 32px;">
              Pozdrawiamy,<br>
              <strong>Zespół CryptoTrend.pl</strong>
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 8px 0;">© 2025 CryptoTrend.pl</p>
            <p style="margin: 0; font-size: 12px;">Otrzymujesz tego e-maila, ponieważ poprosiłeś/aś o darmowy rozdział naszego e-booka.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log("Calling Resend API...");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CryptoTrend <kontakt@cryptotrend.pl>",
        to: [email],
        subject: "📖 Twój darmowy rozdział: Krypto 2026",
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend API error:", error);
      return false;
    }

    const result = await response.json();
    console.info(`Email sent successfully to ${email}, ID: ${result.id}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
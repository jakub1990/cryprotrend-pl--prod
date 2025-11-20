import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { email } = await req.json();

    if (!email || !email.includes("@")) {
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

    const normalizedEmail = email.toLowerCase().trim();

    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existing) {
      if (existing.subscribed) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Jesteś już zapisany do naszego newslettera" 
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      } else {
        const { error: updateError } = await supabase
          .from("newsletter_subscribers")
          .update({
            subscribed: true,
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (updateError) {
          console.error("Update error:", updateError);
          return new Response(
            JSON.stringify({ error: "Failed to update subscription" }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        await sendWelcomeEmail(normalizedEmail, existing.unsubscribe_token);

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Witamy z powrotem! Zostałeś ponownie zapisany" 
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    const { data: newSubscriber, error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: normalizedEmail,
        subscribed: true,
        confirmed: true,
        subscribed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to subscribe" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    await sendWelcomeEmail(normalizedEmail, newSubscriber.unsubscribe_token);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Dziękujemy za zapis! Wkrótce otrzymasz email powitalny." 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function sendWelcomeEmail(email: string, unsubscribeToken: string): Promise<boolean> {
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY not configured");
      return false;
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const unsubscribeLink = `${supabaseUrl}/functions/v1/newsletter-unsubscribe?token=${unsubscribeToken}`;

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
          .footer { 
            background-color: #f9fafb;
            text-align: center; 
            padding: 30px; 
            color: #6b7280; 
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
          }
          .benefits {
            background-color: #f0f9ff;
            padding: 24px;
            border-radius: 8px;
            margin: 24px 0;
          }
          .benefits ul {
            list-style: none;
            padding: 0;
            margin: 12px 0 0 0;
          }
          .benefits li {
            padding: 8px 0;
            color: #1e40af;
          }
          .benefits li:before {
            content: "✓ ";
            color: #0ea5e9;
            font-weight: bold;
            margin-right: 8px;
          }
          .unsubscribe {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 16px;
          }
          .unsubscribe a {
            color: #6b7280;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Witaj w CryptoTrend.pl!</h1>
          </div>
          <div class="content">
            <h2>Dziękujemy za zapisanie się do newslettera</h2>
            
            <p>Cieszymy się, że dołączyłeś/aś do naszej społeczności! Od teraz raz w tygodniu będziesz otrzymywać proste podsumowanie rynku kryptowalut.</p>

            <div class="benefits">
              <strong style="color: #0ea5e9; font-size: 18px;">Co będziesz otrzymywać:</strong>
              <ul>
                <li>Cotygodniowe podsumowanie najważniejszych wydarzeń na rynku krypto</li>
                <li>Analizę trendów bez żargonu technicznego</li>
                <li>Edukacyjne treści bez porad inwestycyjnych</li>
                <li>Informacje o nowych narzędziach i zasobach</li>
              </ul>
            </div>

            <p><strong>Bez spamu, bez nachalnych reklam.</strong> Tylko wartościowe treści, które pomogą Ci zrozumieć rynek kryptowalut.</p>

            <p>Jeśli masz jakieś sugestie lub pytania, napisz do nas na <a href="mailto:kontakt@cryptotrend.pl" style="color: #0ea5e9;">kontakt@cryptotrend.pl</a>.</p>

            <p style="margin-top: 32px;">
              Do usłyszenia wkrótce!<br>
              <strong>Zespół CryptoTrend.pl</strong>
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 8px 0;">© 2025 CryptoTrend.pl</p>
            <p style="margin: 0; font-size: 12px;">Otrzymujesz tego e-maila, ponieważ zapisałeś/aś się do naszego newslettera.</p>
            <p class="unsubscribe">
              Nie chcesz już otrzymywać newsletterów? <a href="${unsubscribeLink}">Wypisz się</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CryptoTrend <kontakt@cryptotrend.pl>",
        to: [email],
        subject: "👋 Witaj w CryptoTrend.pl - Potwierdzenie subskrypcji",
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend API error:", error);
      return false;
    }

    const result = await response.json();
    console.info(`Welcome email sent successfully to ${email}, ID: ${result.id}`);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
}
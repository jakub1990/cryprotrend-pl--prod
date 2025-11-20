import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'Bolt Integration',
    version: '1.0.0',
  },
});

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    const body = await req.text();

    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, { status: 400 });
    }

    EdgeRuntime.waitUntil(handleEvent(event));

    return Response.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function handleEvent(event: Stripe.Event) {
  const stripeData = event?.data?.object ?? {};

  if (!stripeData) {
    return;
  }

  if (!('customer' in stripeData)) {
    return;
  }

  if (event.type === 'payment_intent.succeeded' && event.data.object.invoice === null) {
    return;
  }

  const { customer: customerId } = stripeData;

  if (!customerId || typeof customerId !== 'string') {
    console.error(`No customer received on event: ${JSON.stringify(event)}`);
  } else {
    let isSubscription = true;

    if (event.type === 'checkout.session.completed') {
      const { mode } = stripeData as Stripe.Checkout.Session;

      isSubscription = mode === 'subscription';

      console.info(`Processing ${isSubscription ? 'subscription' : 'one-time payment'} checkout session`);
    }

    const { mode, payment_status } = stripeData as Stripe.Checkout.Session;

    if (isSubscription) {
      console.info(`Starting subscription sync for customer: ${customerId}`);
      await syncCustomerFromStripe(customerId);
    } else if (mode === 'payment' && payment_status === 'paid') {
      try {
        const {
          id: checkout_session_id,
          payment_intent,
          amount_subtotal,
          amount_total,
          currency,
          customer_email,
        } = stripeData as Stripe.Checkout.Session;

        const { error: orderError } = await supabase.from('stripe_orders').insert({
          checkout_session_id,
          payment_intent_id: payment_intent,
          customer_id: customerId,
          customer_email,
          amount_subtotal,
          amount_total,
          currency,
          payment_status,
          status: 'completed',
        });

        if (orderError) {
          console.error('Error inserting order:', orderError);
          return;
        }

        const token = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const { data: customerData } = await supabase
          .from('stripe_customers')
          .select('user_id')
          .eq('customer_id', customerId)
          .maybeSingle();

        if (customerData?.user_id) {
          let userEmail = customer_email;

          if (!userEmail) {
            const { data: userData } = await supabase.auth.admin.getUserById(customerData.user_id);
            userEmail = userData?.user?.email || null;
            console.info(`Retrieved email from user record: ${userEmail}`);
          }

          if (!userEmail) {
            console.error('No email address found for customer');
            return;
          }

          const { error: tokenError } = await supabase
            .from('download_tokens')
            .insert({
              user_id: customerData.user_id,
              product_type: 'ebook',
              token,
              expires_at: expiresAt.toISOString(),
              max_downloads: 5,
            });

          if (tokenError) {
            console.error('Error creating download token:', tokenError);
          } else {
            const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
            const downloadLink = `${supabaseUrl}/functions/v1/ebook-download?token=${token}`;

            await sendEbookEmail(userEmail, downloadLink);
            console.info(`Download link sent to: ${userEmail}`);
          }
        }

        console.info(`Successfully processed one-time payment for session: ${checkout_session_id}`);
      } catch (error) {
        console.error('Error processing one-time payment:', error);
      }
    }
  }
}

async function sendEbookEmail(email: string, downloadLink: string) {
  try {
    const { data: secretData } = await supabase
      .from('app_secrets')
      .select('value')
      .eq('key', 'RESEND_API_KEY')
      .maybeSingle();

    const resendApiKey = secretData?.value || Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey || resendApiKey === 'your_resend_api_key_here') {
      console.warn('RESEND_API_KEY not configured in database or environment, skipping email send');
      console.info(`Email would be sent to: ${email}`);
      console.info(`Download link: ${downloadLink}`);
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
          .success-box {
            background-color: #f0fdf4;
            padding: 24px;
            border-radius: 8px;
            margin: 24px 0;
            border-left: 4px solid #10b981;
          }
          .link-box {
            background: white;
            padding: 15px;
            border-radius: 8px;
            word-break: break-all;
            font-size: 13px;
            border: 1px solid #e5e7eb;
            color: #0ea5e9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Dziękujemy za zakup!</h1>
          </div>
          <div class="content">
            <h2>Twój e-book jest gotowy</h2>

            <div class="success-box">
              <strong style="color: #047857; font-size: 18px;">✓ Płatność zrealizowana pomyślnie</strong>
              <p style="margin: 8px 0 0 0; color: #065f46;">Twój e-book <strong>"Krypto 2026: Zrozumieć rynek"</strong> jest już dostępny do pobrania.</p>
            </div>

            <p style="text-align: center;">
              <a href="${downloadLink}" class="button">📥 Pobierz e-book (PDF)</a>
            </p>

            <div class="important">
              <strong>⚠️ Ważne informacje:</strong><br>
              • Link jest ważny przez <strong>7 dni</strong><br>
              • Możesz pobrać plik maksymalnie <strong>5 razy</strong><br>
              • Zapisz link w bezpiecznym miejscu
            </div>

            <p style="color: #6b7280; font-size: 14px;">Link do pobrania:</p>
            <div class="link-box">${downloadLink}</div>

            <p style="margin-top: 32px;">Jeśli masz jakiekolwiek pytania lub problemy z pobraniem, skontaktuj się z nami na <a href="mailto:kontakt@cryptotrend.pl" style="color: #0ea5e9;">kontakt@cryptotrend.pl</a>.</p>

            <p style="margin-top: 32px;">
              Życzymy owocnej lektury!<br>
              <strong>Zespół CryptoTrend.pl</strong>
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 8px 0;">© 2025 CryptoTrend.pl</p>
            <p style="margin: 0; font-size: 12px;">Otrzymujesz tego e-maila, ponieważ dokonałeś/aś zakupu naszego e-booka.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'CryptoTrend <kontakt@cryptotrend.pl>',
        to: [email],
        subject: '✅ Twój e-book jest gotowy do pobrania - Krypto 2026',
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return false;
    }

    const result = await response.json();
    console.info(`Email sent successfully to ${email}, ID: ${result.id}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

async function syncCustomerFromStripe(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    if (subscriptions.data.length === 0) {
      console.info(`No active subscriptions found for customer: ${customerId}`);
      const { error: noSubError } = await supabase.from('stripe_subscriptions').upsert(
        {
          customer_id: customerId,
          subscription_status: 'not_started',
        },
        {
          onConflict: 'customer_id',
        },
      );

      if (noSubError) {
        console.error('Error updating subscription status:', noSubError);
        throw new Error('Failed to update subscription status in database');
      }
    }

    const subscription = subscriptions.data[0];

    const { error: subError } = await supabase.from('stripe_subscriptions').upsert(
      {
        customer_id: customerId,
        subscription_id: subscription.id,
        price_id: subscription.items.data[0].price.id,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        ...(subscription.default_payment_method && typeof subscription.default_payment_method !== 'string'
          ? {
              payment_method_brand: subscription.default_payment_method.card?.brand ?? null,
              payment_method_last4: subscription.default_payment_method.card?.last4 ?? null,
            }
          : {}),
        status: subscription.status,
      },
      {
        onConflict: 'customer_id',
      },
    );

    if (subError) {
      console.error('Error syncing subscription:', subError);
      throw new Error('Failed to sync subscription in database');
    }
    console.info(`Successfully synced subscription for customer: ${customerId}`);
  } catch (error) {
    console.error(`Failed to sync subscription for customer ${customerId}:`, error);
    throw error;
  }
}

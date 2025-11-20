import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/lib/supabase';
import type { StripeProduct } from '@/stripe-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductCardProps {
  product: StripeProduct;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function ProductCard({ product }: ProductCardProps) {
  const handleCheckout = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            priceId: product.priceId,
            mode: product.mode,
            successUrl: `${window.location.origin}/#/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: window.location.href,
          }),
        }
      );

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe not loaded');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw stripeError;
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Wystąpił błąd podczas przetwarzania płatności. Spróbuj ponownie.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">
          {product.price.toFixed(2)} {product.currency}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCheckout} className="w-full">
          Kup teraz
        </Button>
      </CardFooter>
    </Card>
  );
}

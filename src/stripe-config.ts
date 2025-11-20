export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_TRMaanLbwHT5nj',
    priceId: 'price_1SUTrhHHXRrSkZoeauV00IZa',
    name: 'Krypto 2026: Zrozumieć rynek',
    description: 'Kompleksowy przewodnik po świecie kryptowalut dla każdego, kto chce zrozumieć technologię, rynek i mechanizmy bez zbędnego żargonu',
    price: 19.99,
    currency: 'PLN',
    mode: 'payment'
  }
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}

export function getProductById(id: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.id === id);
}
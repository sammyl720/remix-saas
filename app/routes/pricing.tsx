import { LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import Stripe from 'stripe';
import { PricingData } from '~/types/pricing-data';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

      // Fetch all active products
      const products = await stripe.products.list({ active: true });
    
      // Fetch prices for the products
      const prices = await stripe.prices.list({
        active: true,
        expand: ['data.product'],
      });
      
      // Combine products and prices
      const pricingData: PricingData[] = prices.data
      .filter((price) => price.type === 'recurring')
      .map((price) => {
        const product = price.product as Stripe.Product;
        return {
          priceId: price.id,
          productName: product.name,
          unitAmount: price.unit_amount,
          interval: price.recurring?.interval,
          currency: price.currency,
          description: product.description
        }
      })
      .filter((pricing) => !!pricing.unitAmount)
      .sort((priceA, priceB) => priceA.unitAmount! > priceB.unitAmount! ? -1 : 1)

    return { pricingData };
  } catch (error) {
    console.error('Error fetching pricing data:', error);
    throw new Response('Error fetching pricing data', { status: 500 });
  }
};

export default function Pricing() {
  const { pricingData } = useLoaderData<typeof loader>();

  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Choose Your Plan</h1>
      <div className="flex justify-center space-x-6 flex-wrap">
        {pricingData.map((plan) => (
          <div key={plan.priceId} className="bg-white dark:bg-teal-950 p-6 rounded shadow w-64 mb-6">
            <h2 className="text-2xl font-bold mb-4">{plan.productName}</h2>
            <p className="text-xl mb-6">
              {(plan.unitAmount! / 100).toLocaleString('en-US', {
                style: 'currency',
                currency: plan.currency.toUpperCase(),
              })}{' '}
              per {plan.interval}
            </p>
            <Form method="post" action="/checkout">
              <input type="hidden" name="priceId" value={plan.priceId} />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 transition duration-200"
              >
                Select
              </button>
            </Form>
          </div>
        ))}
      </div>
    </div>
  );
}

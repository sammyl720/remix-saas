// app/routes/checkout.ts
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { getUser } from '~/utils/session.server';
import { supabaseServer } from '~/utils/supabaseServer';
import Stripe from 'stripe';

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await getUser(request);
  if (!user) return redirect('/login');

  const { data: profile } = await supabaseServer
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  const formData = await request.formData();
  const priceId = formData.get('priceId') as string;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  let customerId = profile?.stripe_customer_id;

  // If the user doesn't have a Stripe customer ID, create one
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
    });
    customerId = customer.id;

    // Save the customer ID in Supabase
    await supabaseServer
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id);
  }

  // Create a Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.APP_URL}:${process.env.PORT}/success`,
    cancel_url: `${process.env.APP_URL}:${process.env.PORT}/pricing`,
  });

  // Redirect to the Stripe Checkout
  return redirect(session.url!);
};

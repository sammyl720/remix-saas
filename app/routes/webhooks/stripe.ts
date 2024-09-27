// app/routes/webhooks/stripe.ts
import { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import Stripe from 'stripe';
import { supabaseServer } from '~/utils/supabaseServer';

export const action = async ({ request }: ActionFunctionArgs) => {
  const sig = request.headers.get('stripe-signature')!;
  const payload = await request.text();

  let event;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return json({ error: 'Webhook signature verification failed.' }, 400);
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      // Update subscription details in Supabase
      await supabaseServer
        .from('profiles')
        .update({
          subscription_id: subscription.id,
          subscription_status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000),
        })
        .eq('stripe_customer_id', subscription.customer as string);
      break;
    // ... handle other event types as needed
    default:
      console.warn(`Unhandled event type ${event.type}`);
  }

  return json({ received: true });
};

// app/routes/success.tsx
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Stripe from 'stripe';
import { getUser } from '~/utils/session.server';

export const loader = async ({ request }: LoaderFunctionArgs ) => {
  const user = await getUser(request);
  if (!user) return redirect('/login');

  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');

  let subscription;
  if (sessionId) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    try {
      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['subscription'],
      });
      subscription = checkoutSession.subscription as Stripe.Subscription;
    } catch (error) {
      console.error('Error retrieving checkout session:', error);
    }
  }

  return { user, subscription };
};

export default function Success() {
    const { user, subscription } = useLoaderData<typeof loader>();
  
    return (
      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-4">Subscription Successful!</h1>
        <p className="mb-4">Thank you for subscribing, {user.email}.</p>
        {subscription ? (
          <div>
            <p>Subscription ID: {subscription.id}</p>
            <p>Status: {subscription.status}</p>
          </div>
        ) : (
          <p>We are processing your subscription details.</p>
        )}
      </div>
    );
  }
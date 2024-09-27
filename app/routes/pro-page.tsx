// app/routes/pro-page.tsx
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUser } from '~/utils/session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (!user) return redirect('/login');

  // Check subscription status
  const isActive =
    user.profile?.subscription_status === 'active' ||
    user.profile?.subscription_status === 'trialing';

  if (!isActive) {
    return redirect('/pricing');
  }

  return { user };
};

export default function ProPage() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Pro Features</h1>
      <p>Welcome to the Pro page, {user.email}!</p>
    </div>
  );
}

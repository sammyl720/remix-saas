import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUser } from '~/utils/session.server';

export const loader = async ({ request }: LoaderFunctionArgs ) => {
  const user = await getUser(request);
  if (!user) return redirect('/login');
  return { user };
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="mt-8">
      <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
      <p className="mt-4">This is your dashboard.</p>
    </div>
  );
}

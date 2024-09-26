import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { getUser } from '~/utils/session.server';
import { supabaseServer } from '~/utils/supabaseServer';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (!user) return redirect('/login');

  const { data: profile } = await supabaseServer
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') return redirect('/unauthorized');

  return null;
};

export default function AdminPage() {
  return (
    <div className="mt-8">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <p className="mt-4">Only accessible by admins.</p>
    </div>
  );
}

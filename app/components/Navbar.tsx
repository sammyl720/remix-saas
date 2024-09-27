// app/components/Navbar.tsx
import { Link, useLoaderData, Form } from '@remix-run/react';
import { UserProfile } from '~/types/profile';

export default function Navbar() {
  const data = useLoaderData<{ user?: UserProfile }>();
  const user = data?.user;
  
  return (
    <nav className="bg-white dark:bg-teal-950 shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Remix SaaS
        </Link>
        <div>
          {user ? (
            <>
              <span className="mr-4">
                Hello, {user.email} ({user.profile?.subscription_status || 'Free'})
              </span>
              <Link to="/pricing" className="mr-4">
                Upgrade
              </Link>
              <Form method="post" action="/logout" className="inline">
                <button
                  type="submit"
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </Form>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">
                Login
              </Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

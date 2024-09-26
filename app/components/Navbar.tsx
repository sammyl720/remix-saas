import { Link, Form, useLoaderData } from '@remix-run/react';
import { User } from '@supabase/supabase-js';

export default function Navbar() {
  const { user } = useLoaderData<{ user?: User}>();

  return (
    <nav className="shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          RemixAuth
        </Link>
        <div>
          {user ? (
            <>
              <span className="mr-4">Hello, {user.email}</span>
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

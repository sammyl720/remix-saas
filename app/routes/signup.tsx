import { type ActionFunctionArgs, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { ActionError } from '~/types/action-error';
import { redirectAuthenticatedUser } from '~/utils/loaders';
import { supabaseServer } from '~/utils/supabaseServer';

export const loader = redirectAuthenticatedUser('/');

export const action = async ({ request }: ActionFunctionArgs ) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data, error } = await supabaseServer.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Create user profile with default role
  await supabaseServer.from('profiles').insert([{ id: data.user?.id, role: 'user' }]);

  return redirect('/login');
};

export default function Signup() {
  const actionData = useActionData<ActionError>();
  return (
    <div className="max-w-md mx-auto mt-12 bg-white dark:bg-teal-950 p-8 rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Create an Account</h1>
      {actionData?.error && (
        <p className="text-red-500 mb-4 text-center">{actionData.error}</p>
      )}
      <Form method="post" className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            placeholder="you@example.com"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            placeholder="••••••••"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 transition duration-200"
        >
          Sign Up
        </button>
      </Form>
      <p className="mt-6 text-center text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Log In
        </a>
      </p>
    </div>
  );
}

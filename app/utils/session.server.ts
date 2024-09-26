import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { supabaseServer } from './supabaseServer';

const sessionSecret = process.env.SESSION_SECRET!;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: '__session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
  },
});

export { getSession, commitSession, destroySession };

// Helper functions
export async function createUserSession(accessToken: string, refreshToken: string, redirectTo: string) {
  const session = await getSession();
  session.set('access_token', accessToken);
  session.set('refresh_token', refreshToken);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export async function getUser(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  const accessToken = session.get('access_token');

  if (!accessToken) return null;

  const { data, error } = await supabaseServer.auth.getUser(accessToken);

  if (error) return null;
  return data.user;
}
